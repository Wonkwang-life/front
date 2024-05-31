import Swal from "sweetalert2";

export async function errorAlert(text: string) {
  await Swal.fire({
    title: "오류!",
    text: text,
    icon: "error",
    confirmButtonText: "확인",
  });
}

export async function warningAlert(text: string) {
  const result = await Swal.fire({
    title: "경고!",
    text: text,
    icon: "warning",
    confirmButtonText: "확인",
  });
  return result;
}

export async function Confirm(text: string) {
  const result = await Swal.fire({
    title: "🥺",
    text: text,
    icon: "question",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    showCancelButton: true,
  });

  return result.isConfirmed;
}

export async function CheckConfirm(text: string) {
  const result = await Swal.fire({
    title: "",
    text: text,
    icon: "question",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  });

  return result.isConfirmed;
}

export async function successAlert(text: string) {
  await Swal.fire({
    title: "성공!",
    text: text,
    icon: "success",
    confirmButtonText: "확인",
  });
}
