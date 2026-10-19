const serviceName = "SEONWON"; // 사이트 이름 > string
let isSubmit = false;          // 전송 여부 상태 > boolean
let submitCount = 0;           // 제출 횟수 상태 > number


/* ========== 작업물 데이터 ========== */

const works = [
  {
    id: 1,
    title: "고대 유적 환경",
    category: "3d",
    thumb: "assets/works/The_Hidden_Temple.jpg",
    desc: "고대 유적 환경",
    link: "https://wonseon.artstation.com/projects/DLRoO0",
    linkLabel: "ArtStation에서 보기"
  },
  {
    id: 2,
    title: "전사 석상",
    category: "3d",
    thumb: "assets/works/Guardian.jpg",
    desc: "전사 석상",
    link: "https://wonseon.artstation.com/projects/DLG30G",
    linkLabel: "ArtStation에서 보기"
  },
  {
    id: 3,
    title: "사원 구조물",
    category: "3d",
    thumb: "assets/works/Temple_props.jpg",
    desc: "사원 구조물",
    link: "https://wonseon.artstation.com/projects/wrYlD6",
    linkLabel: "ArtStation에서 보기"
  },
  {
    id: 4,
    title: "강아지 라인 드로잉",
    category: "illust",
    thumb: "assets/works/2dDrawing.jpg",
    desc: "강아지 라인 드로잉",
    link: "https://www.instagram.com/p/Dd9FvDMD2z9/",
    linkLabel: "Instagram에서 보기"
  },
  {
    id: 5,
    title: "강아지 컬러 일러스트",
    category: "illust",
    thumb: "assets/works/2dIllust.jpg",
    desc: "강아지 컬러 일러스트",
    link: "https://www.instagram.com/p/DeFAN1Zj2FG/",
    linkLabel: "Instagram에서 보기"
  },
  {
    id: 6,
    title: "Best Stick Ever",
    category: "illust",
    thumb: "assets/works/Best Stick_Ever.jpg",
    desc: "Best Stick Ever",
    link: "https://www.instagram.com/p/DeL92Jpj-5_/",
    linkLabel: "Instagram에서 보기"
  },
  {
    id: 7,
    title: "수묵 혜성",
    category: "video",
    thumb: "assets/works/GAIFF.jpg",
    desc: "수묵 혜성",
    embed: "https://player.vimeo.com/video/1237160266",
    link: "https://vimeo.com/1237160266",
    linkLabel: "Vimeo에서 보기"
  },
  {
    id: 8,
    title: "HEALING FARM",
    category: "video",
    thumb: "assets/works/HEALING_FARM.jpg",
    desc: "HEALING FARM",
    embed: "https://player.vimeo.com/video/1237158197",
    link: "https://vimeo.com/1237158197",
    linkLabel: "Vimeo에서 보기"
  }
];

// 분야 코드를 화면에 보여줄 이름으로 바꾸는 표
const categoryLabels = {
  "3d": "3D 환경",
  "illust": "2D 일러스트",
  "video": "AI 영상"
};


/* ========== 테마 전환 (click 이벤트) ========== */

const themeButton = document.querySelector("#themeButton");

function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");
  themeButton.textContent = isDark ? "라이트 모드" : "다크 모드";
} // 삼항연산자

themeButton.addEventListener("click", handleThemeClick);


/* ========== 작업 분야 탭 (click 이벤트) ========== */

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// 모든 탭과 패널을 비활성 상태로 되돌림
function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

// 전달받은 탭과 연결된 패널만 활성화
function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();              // 기존 선택 해제
  activateTab(event.currentTarget);  // 클릭한 탭만 켜기
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});


/* ========== 작업물 그리드 그리기 ========== */

const workGrid = document.querySelector("#workGrid");
const filterStatus = document.querySelector("#filterStatus");
const checkAll = document.querySelector("#checkAll");
const categoryChecks = document.querySelectorAll(".category-check");

// 작업물 하나를 카드 HTML로 만듦
function createCard(work) {
  // 영상에만 재생 아이콘을 올림
  const playIcon = work.category === "video"
    ? '<span class="play-icon" aria-hidden="true"></span>'
    : "";

  return `
    <li class="work-card">
      <button type="button" class="work-button" data-id="${work.id}">
        <span class="work-thumb">
          <img src="${work.thumb}" alt="${work.title}">
          ${playIcon}
        </span>
        <span class="work-info">
          <span class="work-title">${work.title}</span>
          <span class="work-category">${categoryLabels[work.category]}</span>
        </span>
      </button>
    </li>
  `;
}

// 체크된 분야만 골라 그리드를 다시 그림
function renderWorks() {
  const checkedValues = [];

  categoryChecks.forEach(function (check) {
    if (check.checked) {
      checkedValues.push(check.value);
    }
  });

  const filtered = works.filter(function (work) {
    return checkedValues.includes(work.category);
  });

  workGrid.innerHTML = filtered.map(createCard).join("");

// 안내 문구 갱신
if (filtered.length === 0) {
  filterStatus.textContent = "선택한 분야가 없습니다. 분야를 하나 이상 선택해 주세요.";
} else if (checkedValues.length === categoryChecks.length) {
  filterStatus.textContent = "전체 작업이 선택되었습니다.";
} else {
  // 체크된 분야 코드(3d, illust...)를 화면용 이름으로 바꿔 이어 붙임
  const names = checkedValues.map(function (value) {
    return categoryLabels[value];
  });

  filterStatus.textContent = "전체 작업 중 " + names.join(", ") + " 분야가 선택되었습니다.";
  }
}

/* ========== 분야 필터 (change 이벤트) ========== */

// 전체 체크 > 개별 체크 전부 맞추기
function handleCheckAll() {
  categoryChecks.forEach(function (check) {
    check.checked = checkAll.checked;
  });

  renderWorks(); // JS로 바꾼 값은 change가 발생하지 않으므로 직접 호출
}

// 개별 체크 > 전부 켜졌을 때만 전체 체크도 켜짐
function handleCategoryCheck() {
  checkAll.checked = Array.from(categoryChecks).every(function (check) {
    return check.checked;
  });

  renderWorks();
}

checkAll.addEventListener("change", handleCheckAll);

categoryChecks.forEach(function (check) {
  check.addEventListener("change", handleCategoryCheck);
});

renderWorks(); // 페이지가 열릴 때 한 번 그림


/* ========== 작업물 상세 모달 (click / keydown 이벤트) ========== */

const workModal = document.querySelector("#workModal");
const modalMedia = document.querySelector("#modalMedia");
const modalTitle = document.querySelector("#modalTitle");
const modalDesc = document.querySelector("#modalDesc");
const modalLink = document.querySelector("#modalLink");

function openModal(work) {
  // 영상이면 플레이어를, 그 외에는 큰 이미지를 넣음
  if (work.category === "video") {
    modalMedia.innerHTML = `
      <iframe src="${work.embed}"
              title="${work.title}"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen></iframe>
    `;
  } else {
    modalMedia.innerHTML = `<img src="${work.thumb}" alt="${work.title}">`;
  }

  modalTitle.textContent = work.title;
  modalDesc.textContent = work.desc;
  modalLink.href = work.link;
  modalLink.textContent = work.linkLabel;

  workModal.hidden = false;
  document.body.classList.add("modal-open"); // 뒷배경 스크롤 막기
}

function closeModal() {
  workModal.hidden = true;
  document.body.classList.remove("modal-open");
  
  modalMedia.innerHTML = "";  // 비워주지 않으면 모달을 닫아도 영상 소리가 계속 납니다
}

// 카드는 JS가 나중에 만들기 때문에, 부모인 그리드에 이벤트를 겁니다
function handleGridClick(event) {
  const button = event.target.closest(".work-button");
  if (!button) {
    return;
  }

  const work = works.find(function (item) {
    return item.id === Number(button.dataset.id);
  });

  openModal(work);
}

workGrid.addEventListener("click", handleGridClick);

// 닫기 버튼과 바깥 덮개 클릭
function handleModalClick(event) {
  if (event.target.dataset.close !== undefined) {
    closeModal();
  }
}

workModal.addEventListener("click", handleModalClick);

// ESC 키로 닫기 (키보드만 쓰는 사람에게는 유일한 닫기 방법입니다)
function handleKeydown(event) {
  if (event.key === "Escape" && workModal.hidden === false) {
    closeModal();
  }
}

document.addEventListener("keydown", handleKeydown);


/* ========== 방문자 인사 (input 이벤트) ========== */

const visitorName = document.querySelector("#visitorName");
const greeting = document.querySelector("#greeting");

function handleVisitorInput() {
  const name = visitorName.value.trim();

  if (name === "") {
    greeting.textContent = "방문해주셔서 감사합니다.";
    return;
  }

  greeting.textContent = "안녕하세요, " + name + "님! 편하게 문의 남겨주세요.";
}

visitorName.addEventListener("input", handleVisitorInput);


/* ========== 문의 유형 안내 (change 이벤트) ========== */

const inquiryType = document.querySelector("#inquiryType");
const inquiryGuide = document.querySelector("#inquiryGuide");

function handleInquiryChange() {
  const type = inquiryType.value;

  if (type === "collab") {
    inquiryGuide.textContent = "프로젝트 기간과 작업 범위를 함께 적어주세요.";
  } else if (type === "work") {
    inquiryGuide.textContent = "원하는 작업물의 종류와 일정을 적어주세요.";
  } else {
    inquiryGuide.textContent = "자유롭게 내용을 남겨주세요.";
  }
}

inquiryType.addEventListener("change", handleInquiryChange);


/* ========== Contact 폼 제출 (submit 이벤트) ========== */

// 함수 호출 전달 받음 (email, sent)
function makeSubmitMessage(email, sent) {
  if (sent == true) {
    return email + "로 보내드렸습니다. 확인 후 답변드리겠습니다.";
  }

  return "이메일을 입력한 뒤 보내주세요.";
}

const contactForm = document.querySelector("#contact-form");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#submitButton");
const submitMessage = document.querySelector("#submitMessage");

function handleSubmit(event) {
  event.preventDefault(); // 폼 제출 기본 동작 방지

  const submitEmail = emailInput.value.trim(); // 이메일 입력값 가져오기
  if (submitEmail === "") {
    submitMessage.textContent = "이메일을 입력한 뒤 보내주세요.";
    emailInput.focus();
    return;
  }

  isSubmit = true;
  submitCount += 1;

  submitMessage.textContent = makeSubmitMessage(submitEmail, isSubmit);
  submitMessage.classList.add("is-success");

  submitButton.textContent = "전송완료";
  submitButton.disabled = true;
}

contactForm.addEventListener("submit", handleSubmit);
