interface Team {
  imgUrl: string;
  position: string;
}

export type TeamName =
  | "team-trai-nghiem"
  | "team-phim-nhac-sach"
  | "team-nhan-su"
  | "team-KTSTN"
  | "team-truyen-thong"
  | "team-nghien-cuu-va-phat-trien"
  | "quy-ktcb";

export interface IIntro {
  title: string;
  content: string;
  banner_url: string;
}

export interface IIntroData {
  [key: string]: IIntro;
}
