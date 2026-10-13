const serviceName = "Study Note"; // 서비스 이름 > string
let isSubmit = false;             // 신청 여부 상태 > boolean
let submitCount = 0;              // 제출 횟수 상태 > number


/* ========== Contact 폼 (submit 이벤트) ========== */
// 함수 호출 전달 받음 (email, subscribe)
function makeSubmitMessage(email, subscribe) {
    if (subscribe == true) {
        return email + "로 신청이 완료 되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해 주세요.";
}

const contactForm = document.querySelector("#contact-form");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#submitButton");
const submitMessage = document.querySelector("#submitMessage");

function handleSubmit(event) {
    event.preventDefault();           // 폼 제출 기본 동작 방지

    const submitEmail = emailInput.value.trim();           // 이메일 입력값 가져오기
    if (submitEmail === "") {
        submitMessage.textContent =
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubmit = true;
    submitCount += 1;

    submitMessage.textContent =
        makeSubmitMessage(submitEmail, isSubmit);

    submitMessage.classList.add("is-success");

    submitButton.textContent = "신청완료";
    submitButton.disabled = true;
}

contactForm.addEventListener("submit", handleSubmit);


/* ========== 테마 (click 이벤트) ========== */
const themeButton = document.querySelector("#themeButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");
    themeButton.textContent = isDark ? "라이트 모드" : "다크 모드";
} // 삼항연산자

themeButton.addEventListener("click", handleThemeClick);


/* ========== 방문자 인사 (input 이벤트) ========== */
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");

function handleNicknameInput() {
    const maxLength = nicknameInput.maxLength;
    const currentLength = nicknameInput.value.length;

    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);



/* ========== 학습 과목 필터 (change 이벤트) ========== */
const checkAll = document.querySelector("#checkAll");
const subjectChecks = document.querySelectorAll(".subject-check");
const subjectCards = document.querySelectorAll("[data-subject]");
const filterStatus = document.querySelector("#filterStatus");

// 체크 상태에 맞춰 카드를 보이거나 숨김
function applyFilter() {
    const checkedValues = [];

    subjectChecks.forEach(function (check) {
        if (check.checked) {
            checkedValues.push(check.value);
        }
    });

    subjectCards.forEach(function (card) {
        if (checkedValues.includes(card.dataset.subject)) {
            card.style.display = "";       // 기본값으로 되돌림 = 보이기
        } else {
            card.style.display = "none";   // 숨기기
        }
    });

    // 안내 문구 갱신
    if (checkedValues.length === 0) {
        filterStatus.textContent = "선택한 과목이 없습니다.";
    } else if (checkedValues.length === subjectChecks.length) {
        filterStatus.textContent = "전체 과목을 보여주는 중입니다.";
    } else {
        filterStatus.textContent = checkedValues.length + "개 과목을 보여주는 중입니다.";
    }
}

// 전체 체크 > 개별 체크 전부 맞추기
function handleCheckAll() {
    subjectChecks.forEach(function (check) {
        check.checked = checkAll.checked;
    });

    applyFilter(); //JS로 바꾼 값은 change가 발생하지 않으므로 직접 호출
}

// 개별 체크 > 전부 켜졌을 때만 전체 체크도 켜짐
function handleSubjectCheck() {
    checkAll.checked = Array.from(subjectChecks).every(function (check) {
        return check.checked;
    });

    applyFilter();
}

checkAll.addEventListener("change", handleCheckAll);

subjectChecks.forEach(function (check) {
    check.addEventListener("change", handleSubjectCheck);
});

applyFilter(); // 페이지가 열릴 때 한 번 실행해 초기 상태를 맞춤


/* ========== 주요 기능 탭 (click 이벤트) ========== */
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    // 1. 모든 탭을 비활성 상태로 되돌림
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });

    // 2. 모든 패널을 숨김
    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab){
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    // 3. 클릭한 탭만 활성화
    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    //4. 연결된 패널만 표시 (data-target 값이 "#feature-subjects" 형태)
    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();   //기존선택 해제
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});