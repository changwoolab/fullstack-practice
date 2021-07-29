import session from 'express-session';

// 영상 올라올 때와 달라져서 userId 같은 디테일한 것들은 직접 정의해줘야 한다.
declare module 'express-session' {
  export interface SessionData {
    userId: number;
  }
}