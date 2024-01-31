const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router();
const db = require('../data/db');
const { insertTodayTape, insertTapeMusic } = require('./publishing.sql');

// SpotifyWebApi 인스턴스 설정
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Spotify API로부터 액세스 토큰을 얻는 함수
async function getSpotifyAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (error) {
    console.error('Spotify 액세스 토큰을 얻는 중 에러 발생', error);
    throw error;
  }
}

// Spotify API를 호출하여 음악 정보를 가져오는 함수
async function fetchSpotifyMusicData(trackId) {
  await getSpotifyAccessToken(); // 액세스 토큰을 설정합니다.
  try {
    const data = await spotifyApi.getTrack(trackId);
    return {
      musicId: trackId,
      content: data.body.name // 또는 가져오고 싶은 다른 정보
    };
  } catch (error) {
    console.error('Spotify로부터 음악 정보를 가져오는 중 에러 발생', error);
    throw error;
  }
}

// 오늘의 테이프 정보 등록 API
router.post('/tape/today', async (req, res) => {
  const { tapeImg, tapeTitle, tapeIntro, tapeComment, tapeMusicData } = req.body;

  try {
    // 먼저 tape 테이블에 오늘의 테이프 정보를 등록
    const tapeResult = await db.query(insertTodayTape, [tapeImg, tapeTitle, tapeIntro]);
    const tapeId = tapeResult.insertId;

    // Spotify API를 사용하여 음악 정보를 가져온 후 데이터베이스에 저장
    if (tapeMusicData && tapeMusicData.length > 0) {
      // 각 트랙 ID에 대해 Spotify API를 호출
      const musicDataPromises = tapeMusicData.map(async (music) => {
        return await fetchSpotifyMusicData(music.spotifyTrackId);
      });
      const fetchedMusicData = await Promise.all(musicDataPromises);

      // 가져온 음악 정보를 데이터베이스에 저장
      await Promise.all(fetchedMusicData.map(async (music) => {
        if (music) {
          return await db.query(insertTapeMusic, [tapeId, music.musicId, music.content]);
        }
      }));
    }

    res.status(201).json({
      success: true,
      message: '오늘의 테이프 정보 등록',
      tapeId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '데이터베이스 오류 또는 Spotify API 오류 발생'
    });
  }
});

// 테이프 상세 정보 불러오기 API
router.get('/tape/:tapeid', async (req, res) => {
  const tapeId = req.params.tapeid; // 변수 destructuring 수정

  try {
    const tapeDetails = await db.query(getTapeDetailsById, [tapeId]);

    if (tapeDetails.length > 0) {
      // 각 음악에 대한 Spotify 정보를 가져옵니다.
      const musicDetailsPromises = tapeDetails.map(detail =>
        fetchSpotifyMusicData(detail.music_id)
      );
      const musicDetails = await Promise.all(musicDetailsPromises);

      const tapeData = tapeDetails.map((detail, index) => ({
        tapeImg: detail.tapeimageurl,
        tapeTitle: detail.title,
        tapeIntro: detail.content,
        postDate: detail.created_at,
        tapeMusicData: musicDetails[index] || { musicId: detail.music_id, content: detail.music_content }
      }));

      res.status(200).json({
        success: true,
        message: '테이프 상세 정보 조회 성공',
        tapedata: tapeData[0]
      });
    } else {
      res.status(404).json({
        success: false,
        message: '테이프 정보를 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '데이터베이스 오류가 발생했습니다.'
    });
  }
});

// 테이프 듣기 API
router.get('/tape/listen/:tapeid', async (req, res) => {
  const tapeId = req.params.tapeid; // 변수 destructuring 수정

  try {
    // 특정 tape ID에 해당하는 상세 데이터를 조회합니다.
    const tapeDetails = await db.query(getTapeDetailsById, [tapeId]);

    if (tapeDetails.length > 0) {
      // 각 음악에 대한 Spotify 정보를 가져옵니다.
      const musicDetailsPromises = tapeDetails.map(detail =>
        fetchSpotifyMusicData(detail.music_id)
      );
      const musicDetails = await Promise.all(musicDetailsPromises);

      const tapeMusicData = musicDetails.map((detail, index) => ({
        musicId: tapeDetails[index].music_id,
        content: detail || tapeDetails[index].music_content
      }));

      res.status(200).json({
        query: { tapeId },
        result: {
          success: true,
          message: '테이프 정보 조회 성공',
          tapeMusicData
        }
      });
    } else {
      res.status(404).json({
        query: { tapeId },
        result: {
          success: false,
          message: '테이프 정보를 찾을 수 없습니다.'
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      query: { tapeId },
      result: {
        success: false,
        message: '데이터베이스 오류 발생'
      }
    });
  }
});

// DELETE 
router.delete('/tape', async (req, res) => {
  const { tapeId } = req.query; 

  if (!tapeId) {
    return res.status(400).json({
      query: { tapeId },
      result: {
        success: false,
        message: 'tapeId query parameter is required'
      }
    });
  }

  try {
    // 테이프를 삭제하는 SQL 쿼리
    const deleteTapeSql = 'DELETE FROM tape WHERE id = ?';
    const result = await db.query(deleteTapeSql, [tapeId]);

    if (result.affectedRows > 0) {
      res.json({
        query: { tapeId },
        result: {
          success: true,
          message: 'Tape deleted successfully'
        }
      });
    } else {
      res.status(404).json({
        query: { tapeId },
        result: {
          success: false,
          message: 'Tape not found'
        }
      });
    }
  } catch (error) {
    console.error('Error deleting tape:', error);
    res.status(500).json({
      query: { tapeId },
      result: {
        success: false,
        message: 'Internal Server Error'
      }
    });
  }
});

module.exports = router;
