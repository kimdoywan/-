const market = {
  name: "구미새마을중앙시장",
  appName: "구전이",
  address: "경북 구미시 구미중앙로9 길 11 (원평동)",
  hours: "07:00~18:00 ( 점포마다 다름)",
  phone: "054-452-3611",
  intro: "구미역 바로 옆, 400      개가 넘는 점포가 모인 구미의 대표 전통시장"
};

const categories = [
  { id: "food", name: "먹거리", color: "#E8590C" },
  { id: "farm", name: "농산물", color: "#2F9E44" },
  { id: "sea", name: "수산물", color: "#1971C2" },
  { id: "cloth", name: "의류· 한복", color: "#9C36B5" },
  { id: "etc", name: "생활용품", color: "#5C677D" }
];

const alleys = ["순대골목", "국수골목", "족발골목", "한복골목"];

//   골목별 위치 (x, y):  순대골목 20, 25 /  국수골목 72, 22 /  족발골목 22, 78 /  한복골목 75, 75 /   골목 없음 50, 45 근처
const stores = [
  { id: 1, name: "예시 순대집", category: "food", alley: "순대골목", products: ["순대", "순대국밥"], hours: "09:00~20:00", x: 20, y: 25, phone: "", photo: "" },
  { id: 2, name: "예시 국수집", category: "food", alley: "국수골목", products: ["잔치국수", "비빔국수"], hours: "10:00~19:00", x: 72, y: 22, phone: "", photo: "" },
  { id: 3, name: "예시 족발집", category: "food", alley: "족발골목", products: ["무침족발", "불족발"], hours: "11:00~21:00", x: 22, y: 78, phone: "", photo: "" },
  { id: 4, name: "예시 한복집", category: "cloth", alley: "한복골목", products: ["한복 대여", "한복 맞춤"], hours: "09:00~18:00", x: 75, y: 75, phone: "", photo: "" },
  { id: 5, name: "예시 채소가게", category: "farm", alley: "", products: ["배추", "무", "제철 과일"], hours: "07:00~18:00", x: 38, y: 40, phone: "", photo: "" },
  { id: 6, name: "예시 생선가게", category: "sea", alley: "", products: ["고등어", "오징어"], hours: "07:00~17:00", x: 62, y: 42, phone: "", photo: "" }
];

const parkings = [
  { name: "새마을중앙시장 주차장", place: "시장 옆", fee: "최초 30 분 400원, 이후 10 분당 200 원", note: "요금은 시장 소개 자료 기준" },
  { name: "구미역 후면광장 지하주차장", place: "구미역 뒤편", fee: "현장 확인", note: "시장까지 걸어서 이동" }
];
