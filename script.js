const serviceName = "Study Note"; // 서비스 이름 > string
let idSubmit= false; // 구독 여부 상태 > boolean
let submitCount = 0; // 제출 횟수 상태 > number


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
