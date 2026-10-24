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
    desc: "UE5의 루멘과 나나이트를 활용하여 배경의 광원과 씬의 디테일을 구현했습니다.",
    link: "https://wonseon.artstation.com/projects/DLRoO0",
    linkLabel: "ArtStation에서 보기"
  },
  {
    id: 2,
    title: "전사 석상",
    category: "3d",
    thumb: "assets/works/Guardian.jpg",
    desc: "지브러쉬로 제작한 석상",
    link: "https://wonseon.artstation.com/projects/wrYlD6",
    linkLabel: "ArtStation에서 보기"
  },
  {
    id: 3,
    title: "사원 구조물",
    category: "3d",
    thumb: "assets/works/Temple_props.jpg",
    desc: "배경제작을 위해 정리한 프랍의 디테일을 모아놓았습니다. ",
    link: "https://wonseon.artstation.com/projects/DLG30G",
    linkLabel: "ArtStation에서 보기"
  },
  {
    id: 4,
    title: "강아지 라인 드로잉",
    category: "illust",
    thumb: "assets/works/2dDrawing.jpg",
    desc: "반려동물 라인 드로잉",
    link: "https://www.instagram.com/p/Dd9FvDMD2z9/",
    linkLabel: "Instagram에서 보기"
  },
  {
    id: 5,
    title: "강아지 컬러 일러스트",
    category: "illust",
    thumb: "assets/works/2dIllust.jpg",
    desc: "반려동물 캐주얼 일러스트",
    link: "https://www.instagram.com/p/DeFAN1Zj2FG/",
    linkLabel: "Instagram에서 보기"
  },
  {
    id: 6,
    title: "Best Stick Ever",
    category: "illust",
    thumb: "assets/works/Best Stick_Ever.jpg",
    desc: "반려동물 일러스트로 제작한 굿즈",
    link: "https://www.instagram.com/p/DeL92Jpj-5_/",
    linkLabel: "Instagram에서 보기"
  },
  {
    id: 7,
    title: "GAIFF",
    category: "video",
    thumb: "assets/works/GAIFF.jpg",
    desc: "2026 관악 생성형 AI 영상 콘텐츠 공모전 (GAIFF)에 제출했던 AI로 제작된 영상",
    embed: "https://player.vimeo.com/video/1237158197",
    link: "https://vimeo.com/1237158197",
    linkLabel: "Vimeo에서 보기"
  },
  {
    id: 8,
    title: "HEALING FARM",
    category: "video",
    thumb: "assets/works/HEALING_FARM.jpg",
    desc: "미드저니와 캡컷을 이용해서 제작한 AI애니메이션",
    embed: "https://player.vimeo.com/video/1237160266",
    link: "https://vimeo.com/1237160266",
    linkLabel: "Vimeo에서 보기"
  }
];

// 분야 코드를 화면에 보여줄 이름으로 바꾸는 표
const categoryLabels = {
  "3d": "3D 그래픽",
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

let currentWork = null; //지금 모달에 열려있는 작업. 버튼을 눌렀을 때 "어떤 작업인지" 알기위해 보관.

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

  currentWork = work;  //문의하기 버튼이 어떤작업인지 알 수 있도록 기억함. 열 때 마다"지금 보는 작업"을 기억.
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

// ESC 키로 닫기 (키보드만 쓰는 사람에게는 유일한 닫기 방법)
function handleKeydown(event) {
  if (event.key === "Escape" && workModal.hidden === false) {
    closeModal();
  }
}

document.addEventListener("keydown", handleKeydown);

// 모달안의 "이작업으로 문의하기" :  모달을 닫고 contact로 이동
const modalInquiryButton = document.querySelector("#modalInquiryButton");   // 모달의 "이 작업으로 문의하기 버튼."

function handleModalInquiryClick(){
  const work = currentWork;     //모달을 닫기전에 closeModal()이 currentWork를 지울 수 있어 닫기전에 변수를 잡아둠.

  closeModal();                 //모달을 닫고 배경 스크롤, 포커스 원위치.
  startInquiryFromWork(work);   //아래의 작업물에서 문의로 이어지는 블록함수(문의 흐름시작)
}

modalInquiryButton.addEventListener("click", handleModalInquiryClick);

/* ========== 방문자 인사 (input 이벤트) ========== */

const visitorName = document.querySelector("#visitorName");
const greeting = document.querySelector("#greeting");
const defaultGreeting = "방문해주셔서 감사합니다."; //다시 시작할 때도 이 문구로 되돌아간다.

function handleVisitorInput() {
  const name = visitorName.value.trim();

  if (name === "") {
    greeting.textContent = defaultGreeting;
    return;
  }

  greeting.textContent = "안녕하세요, " + name + "님! 편하게 문의 남겨주세요.";
}

visitorName.addEventListener("input", handleVisitorInput);


/* ========== 문의 유형 안내 (change 이벤트) ========== */

const inquiryType = document.querySelector("#inquiryType");
const inquiryGuide = document.querySelector("#inquiryGuide");
const defaultGuide = "문의 유형을 고르면 작성 안내가 표시됩니다."; // 선택 전, 그리고 다시 시작할 때의 문구

function handleInquiryChange() {
  const type = inquiryType.value;

  if (type === "") {
    inquiryGuide.textContent = defaultGuide;
  } else if (type === "collab") {
    inquiryGuide.textContent = "프로젝트 기간과 작업 범위를 함께 적어주세요.";
  } else if (type === "work") {
    inquiryGuide.textContent = "원하는 작업물의 종류와 일정을 적어주세요.";
  } else {
    inquiryGuide.textContent = "자유롭게 내용을 남겨주세요.";
  }
}

inquiryType.addEventListener("change", handleInquiryChange);


/* ========== Contact 문의 흐름 (4단계) ========== */

/*
  사용자 목표 : 협업·작업 문의를 남긴다
  완료 조건   : 3단계에서 제출하면 4단계 완료 화면이 표시된다

  행동 > 이벤트 > 조건 > 화면 반응 > 다음 상태
  ① 다음 클릭     > click  > 필수 입력 통과 > 다음 단계 표시, 진행 문구 갱신        > step + 1
  ② 다음 클릭     > click  > 필수 입력 누락 > 이동을 막고 오류 안내, 해당 칸에 focus > step 유지
  ③ 이전 클릭     > click  > 항상           > 이전 단계 표시, 입력값은 그대로       > step - 1
  ④ 수정 클릭     > click  > 3단계에서      > 해당 단계로 이동                      > step = 1 또는 2
  ⑤ 제출 클릭     > submit > 3단계에서      > 완료 화면 표시                        > isComplete = true
  ⑥ 새 문의 작성  > click  > 4단계에서      > 입력·선택·오류·진행 상태 초기화       > step = 1
*/

const totalSteps = 4;
const stepNames = ["", "문의 유형", "연락 정보", "내용 확인", "완료"];

// 흐름 상태 : 확인 화면은 이 객체를 기준으로 그립니다
const inquiry = {
  step: 1,
  type: "",
  interests: [],
  name: "",
  email: "",
  message: "",
  relatedWork: null,   //문의와 연결된 작업. (없으면 null, 작업객체면 "그 작업과연결중.")
  isComplete: false
};

const typeLabels = {
  collab: "협업 문의",
  work: "작업 문의",
  etc: "기타"
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactForm = document.querySelector("#contact-form");
const stepPanels = document.querySelectorAll(".step-panel");
const stepStatus = document.querySelector("#stepStatus");
const interestChecks = document.querySelectorAll(".interest-check");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const submitMessage = document.querySelector("#submitMessage");

const sumType = document.querySelector("#sumType");
const sumInterests = document.querySelector("#sumInterests");
const sumName = document.querySelector("#sumName");
const sumEmail = document.querySelector("#sumEmail");
const sumMessage = document.querySelector("#sumMessage");
const sumWorkRow = document.querySelector("#sumWorkRow");   //관련작업 행 전체
const sumWork = document.querySelector("#sumWork");         //행안의 작품명 자리

/* ----- 단계 전환 ----- */

// n단계 패널만 보여줌 (탭의 "전부 끄고 하나만 켜기"와 같은 방식)
function showStep(n) {
  stepPanels.forEach(function (panel) {
    panel.hidden = Number(panel.dataset.step) !== n;
  });

  stepStatus.textContent = n + " / " + totalSteps + " 단계 · " + stepNames[n];
  inquiry.step = n;
  linkStatus.textContent = "";        //단계가 바뀌면 이전 연결안내를 지움.
}

// 단계가 바뀐 뒤 제목으로 포커스를 옮김 (키보드·스크린리더 사용자가 위치를 잃지 않게)
function focusStepTitle(n) {
  const title = document.querySelector('.step-panel[data-step="' + n + '"] h3');
  title.focus();
}


/* ----- 오류 안내 ----- */

// 칸 하나의 오류 문구와 표시를 지움
function clearFieldError(field) {
  const errorBox = field.querySelector(".field-error");
  errorBox.textContent = "";
  errorBox.hidden = true;

  field.querySelectorAll("[aria-invalid]").forEach(function (control) {
    control.removeAttribute("aria-invalid");
  });
}

function clearAllErrors() {
  contactForm.querySelectorAll(".field").forEach(function (field) {
    clearFieldError(field);
  });
}

// 오류 문구를 보여주고 입력 칸에 aria-invalid를 붙임
function showError(control, message) {
  const field = control.closest(".field");
  const errorBox = field.querySelector(".field-error");

  errorBox.textContent = message;
  errorBox.hidden = false;
  control.setAttribute("aria-invalid", "true");
}

// 사용자가 고치기 시작하면 그 칸의 오류 문구는 지움
function handleFieldFix(event) {
  const field = event.target.closest(".field");

  if (field) {
    clearFieldError(field);
  }
}

contactForm.addEventListener("input", handleFieldFix);
contactForm.addEventListener("change", handleFieldFix);


/* ----- 검사와 저장 ----- */

// 해당 단계의 필수 입력을 검사. 통과하면 true, 하나라도 문제면 false
function validateStep(n) {
  const problems = [];

  if (n === 1) {
    if (inquiryType.value === "") {
      problems.push({
        control: inquiryType,
        message: "문의 유형을 선택해 주세요. 협업·작업·기타 중 하나를 고르면 됩니다."
      });
    }

    const hasInterest = Array.from(interestChecks).some(function (check) {
      return check.checked;
    });

    if (!hasInterest) {
      problems.push({
        control: interestChecks[0],
        message: "관심 분야를 하나 이상 선택해 주세요."
      });
    }
  }

  if (n === 2) {
    if (visitorName.value.trim() === "") {
      problems.push({
        control: visitorName,
        message: "이름을 입력해 주세요. 답변할 때 부를 이름입니다."
      });
    }

    const email = emailInput.value.trim();

    if (email === "") {
      problems.push({
        control: emailInput,
        message: "이메일을 입력해 주세요. 답변을 받을 주소입니다."
      });
    } else if (!emailPattern.test(email)) {
      problems.push({
        control: emailInput,
        message: "이메일 형식이 올바르지 않습니다. 예: name@example.com"
      });
    }

    if (messageInput.value.trim() === "") {
      problems.push({
        control: messageInput,
        message: "문의 내용을 입력해 주세요. 원하는 작업과 일정을 적어주시면 좋습니다."
      });
    }
  }

  clearAllErrors(); // 이전 오류는 지우고, 지금 남은 문제만 다시 표시

  problems.forEach(function (problem) {
    showError(problem.control, problem.message);
  });

  if (problems.length > 0) {
    problems[0].control.focus(); // 가장 위의 문제 칸으로
    return false;
  }

  return true;
}

// 해당 단계의 입력값을 상태에 보관
function saveStep(n) {
  if (n === 1) {
    inquiry.type = inquiryType.value;
    inquiry.interests = Array.from(interestChecks)
      .filter(function (check) {
        return check.checked;
      })
      .map(function (check) {
        return check.value;
      });
  }

  if (n === 2) {
    inquiry.name = visitorName.value.trim();
    inquiry.email = emailInput.value.trim();
    inquiry.message = messageInput.value.trim();
  }
}

//확인 화면의 '관련작업'행> 연결된 작업이 있을 때만 보여줌> 연결이 없으면 행을 숨기고 끝.
function renderSummaryWork(){
  if (inquiry.relatedWork === null){
    sumWorkRow.hidden = true;
    return;
  }
  sumWork.textContent = inquiry.relatedWork.title;      // 작품명 채우기
  sumWorkRow.hidden = false;                            // 행 보이기
}

// 3단계 확인 화면을 상태 값으로 채움
function renderSummary() {
  sumType.textContent = typeLabels[inquiry.type];

  sumInterests.textContent = inquiry.interests.map(function (value) {
    return categoryLabels[value];
  }).join(", ");

  sumName.textContent = inquiry.name;
  sumEmail.textContent = inquiry.email;
  sumMessage.textContent = inquiry.message;
  renderSummaryWork();                                  //확인화면을 그릴 때 '관련작업' 행도 같이 맞춤.
}


/* ----- 버튼 동작 ----- */

function handleNextClick() {
  if (!validateStep(inquiry.step)) {
    return; // 필수 입력이 비어 있으면 다음 단계로 가지 않음
  }

  saveStep(inquiry.step);

  const nextStep = inquiry.step + 1;

  if (nextStep === 3) {
    renderSummary();
  }

  showStep(nextStep);
  focusStepTitle(nextStep);
}

function handlePrevClick() {
  saveStep(inquiry.step); // 쓰던 값도 보관 (이전으로 갈 때는 검사하지 않음)
  showStep(inquiry.step - 1);
  focusStepTitle(inquiry.step);
}

function handleEditClick(event) {
  showStep(Number(event.currentTarget.dataset.goto));
  focusStepTitle(inquiry.step);
}

document.querySelectorAll(".next-button").forEach(function (button) {
  button.addEventListener("click", handleNextClick);
});

document.querySelectorAll(".prev-button").forEach(function (button) {
  button.addEventListener("click", handlePrevClick);
});

document.querySelectorAll(".edit-button").forEach(function (button) {
  button.addEventListener("click", handleEditClick);
});


/* ----- 제출과 완료 (submit 이벤트) ----- */

// 함수 호출 전달 받음 (email, sent)
function makeSubmitMessage(email, sent) {
  if (sent == true) {
    return email + " 확인 후 연락 드리겠습니다. 감사합니다.";
  }

  return "이메일을 입력한 뒤 제출해 주세요.";
}

function finishInquiry() {
  isSubmit = true;
  submitCount += 1;
  inquiry.isComplete = true;

  submitMessage.textContent = makeSubmitMessage(inquiry.email, isSubmit);
  submitMessage.classList.add("is-success");

  //작업물에서 이어진 문의라면 어떤 작업인지 완료 문구에 덧붙임.
  if (inquiry.relatedWork !== null){
    submitMessage.textContent += " (관련작업 : " + inquiry.relatedWork.title + ")";   //완료문구 끝에 어떤 작업으로 문의 했는지 덧붙임
  }

  renderWorkLink();                         //완료상태(isComplete)가 되고, "문의하는 중" 표시줄을 숨김.
  linkStatus.textContent = "";              //연결안내 문구도 지움.

  showStep(4);
  focusStepTitle(4);
}

function handleSubmit(event) {
  event.preventDefault(); // 폼 제출 기본 동작 방지

  // 1~2단계에서 Enter 키로 제출되면 "다음" 버튼과 똑같이 처리
  if (inquiry.step < 3) {
    handleNextClick();
    return;
  }

  // 완료 상태에서는 다시 제출되지 않음
  if (inquiry.isComplete) {
    return;
  }

  finishInquiry();
}

contactForm.addEventListener("submit", handleSubmit);


/* ----- 처음부터 다시 시작 ----- */

// 입력·선택·오류·진행 상태를 전부 처음으로 되돌림
function resetInquiry() {
  // 상태
  inquiry.type = "";
  inquiry.interests = [];
  inquiry.name = "";
  inquiry.email = "";
  inquiry.message = "";
  inquiry.isComplete = false;
  inquiry.relatedWork = null;       //초기화할 때 연결도 같이 지워야 새 문의에 이전 작업이 남지않음.
  isSubmit = false;

  // 화면
  contactForm.reset();        // 입력 칸, 선택, 체크박스를 처음 값으로
  clearAllErrors();
  greeting.textContent = defaultGreeting;
  inquiryGuide.textContent = defaultGuide;
  submitMessage.textContent = "";
  submitMessage.classList.remove("is-success");

  renderWorkLink();                 //상태가 바뀌고 표시줄을 다시그림>> 숨겨짐
  linkStatus.textContent = "";      //이전 안내 문주 지움.

  // 진행
  showStep(1);
  focusStepTitle(1);
}

document.querySelector("#restartButton").addEventListener("click", resetInquiry);


/* ========== 작업물에서 문의로 이어지기 (click 이벤트) ========== */
/*
  사용자 목표 : 마음에 든 작업을 보고, 그 작업에 대해 바로 문의한다
  
  행동 > 이벤트 > 조건 > 화면 반응 > 다음 상태
  1. 모달에서 문의하기 클릭 > click > 항상            > 모달 닫힘, 유형·분야 채움, 연결 표시줄 표시, 1단계로 이동 > relatedWork = 그 작업, step = 1
  2. 문의하기 클릭        > click > 이미 완료된 문의  > 이전 문의를 초기화한 뒤 ①과 같이 진행                    > isComplete = false
  3. 연결해제 클릭        > click > 연결된 작업 있음  > 표시줄 숨김, 고른 값·입력값은 그대로                     > relatedWork = null
*/

//화면에서 쓰는 요소들.
const workLink = document.querySelector("#workLink");             //연결표시줄
const workLinkText = document.querySelector("#workLinkText");     //상자안의 "작품명~~~"채우는글
const linkStatus = document.querySelector("#linkStatus");         //연결,해제 결과 안내문구
const unlinkButton = document.querySelector("#unlinkButton");     //연결해제버튼

//연결된 작업이 있으면 표시줄을 보여주고, 없으면 숨기.
function renderWorkLink() {
  renderSummaryWork();   //확인화면의 관련 작업행을 같이 맞춘다.

  if (inquiry.relatedWork === null || inquiry.isComplete) {   //완료 후에는 "문의하는 중" 표시줄이 숨겨짐.
    workLink.hidden = true;
    return;
  }

  workLinkText.textContent = "'" + inquiry.relatedWork.title + "' 작업을 보고 문의 하는 중입니다.";
  workLink.hidden = false;
}

// 1단계 : 원하는 작업 분야의 문의 유형을 선택.
//문의유형 = 작업문의, 관심분야 = 작업의 체크박스
function applyWorkChoices(work) {
  inquiryType.value = "work";
  handleInquiryChange();   //코드로 바꾼 값은 change 이벤트가 일어나지 않으므로 안내 문구도 직접 갱신된다.

  interestChecks.forEach(function (check) {
    check.checked = check.value === work.category;   //작업분야가 같은 칸만 체크
  });

  clearAllErrors();   //이전에 떠 있던 오류 문구 정리
  saveStep(1);        //채운 값을 상태(inquiry)박스에도 보관
}

//작업물에서 문의로 들어오는 과정 : 끝난 문의면 새 문의로 시작 > 선택값 채움 > 작업 연결 표시 > 1단계로 이동-포커스-스크롤
function startInquiryFromWork(work) {
  if (inquiry.isComplete) {
    resetInquiry();       //이전 문의가 끝난 상태면 새 문의로 시작
  }

  //현재 연결된 작업과 같은 작업은 다시 누를 경우> 다시 채워지지않고 안내함.(조건확인)
  //완료 후라면 위에서 resetInquiry()에 relatedWork가 null이 되어 이 조건에 걸리지 않고 새 문의로 진행
  if (inquiry.relatedWork !== null && inquiry.relatedWork.id === work.id){
    showAlreadyLinked(work);
    return;                 //아래 '채우기' 과정을 건너뜀
  }

  applyWorkChoices(work);
  inquiry.relatedWork = work;                 //상태에 '어떤 작업과 연결되었는지' 저장
  renderWorkLink();                           //저장한 상태를 반영
  
  showStep(1);                                //머물던 단계가 몇번째이든 1단계로(이름, 이메일, 메세지는 그대로)
  //**순서 주의** showStep이 안내 문구를 지우므로, 문구는 showStep "뒤에" 써야 화면에 남는다.
  linkStatus.textContent = "'" + work.title + "' 작업에 맞춰 문의 유형을 채웠습니다.";

  //키보드 사용자가 contact에서 이어가도록 포커스를 옮기고, 화면 이동은 스크롤에 맡김.
  document.querySelector('.step-panel[data-step="1"] h3').focus({ preventScroll: true });     // preventScroll: 포커스 때문에 화면이 순간이동하지 않게해, 부드러운 스크롤을 살림
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
}

//같은 작업을 다시 눌렀을 때, 고른값, 입력내용, 보던 단계를 유지하고 이미 연결되었음을 알려줌.
function showAlreadyLinked(work){
  linkStatus.textContent = "'" + work.title + "'작업이 이미 연결되어 있습니다. 입력된 내용은 유지합니다.";

  //1단계로 리턴없이 지금 단계(inquiry)의 제목으로 포커스를 이동.
  document.querySelector('.step-panel[data-step="' + inquiry.step + '"] h3').focus({ preventScroll: true});
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth"});
}

//연결해제 = 작업과의 연결만 끊음. 이미 채워진 내용은 건드리지않음.
function handleUnlinkClick() {
  inquiry.relatedWork = null;
  renderWorkLink();
  linkStatus.textContent = "작업연결을 해제 했습니다. 선택 값과 입력된 내용은 삭제 되지 않았습니다.";
}

unlinkButton.addEventListener("click", handleUnlinkClick);    //여기까지 추가됨.

showStep(1); // 페이지가 열릴 때 1단계로 시작. **위로 옮기지 않기**
