const errorMessageForUser = (messageFromServer) => {
    const errorList = {
        INCORRECT_LOGIN_OR_PASSWORD: "Не корректный логин или пароль",
        REGISTRATION_EMAIL_IS_EXISTS: "Такой E-MAIL уже существует",
        UPDATE_ACCOUNT_REJECT_ANOTHER_ACCOUNT: "Вы не можете обновить аккаунт, так как вы не его владелец",
        CHANGE_CREDENTIALS_REJECT_ANOTHER_ACCOUNT: "Вы не можете изменить учетную запись, так как вы не ее владелец",
        CHANGE_CREDENTIALS_EMPTY_NEW_EMAIL_REJECT: "Новый E-MAIL не может быть пуст",
        CHANGE_CREDENTIALS_EMAIL_IS_EXISTS: "Такой E-MAIL уже существует",
        CHANGE_CREDENTIALS_INCORRECT_OLD_PASSWORD: "Старый пароль был введен не верно",
        CHANGE_CREDENTIALS_EMPTY_NEW_PASSWORD: "Новый пароль не может быть пуст",
        FRIEND_REQUEST_ALREADY_EXISTS: "Запрос на добавление в друзья уже отправлен",
        FRIEND_REQUEST_DOES_NOT_EXISTS: "Входящая заявка в друзья отсутствует",
        FRIEND_REQUEST_ALREADY_ACCEPTED: "Заявка в друзья уже была принята",
        GROUP_REQUEST_ALREADY_EXISTS: "Запрос на вступление в группу уже отправлен",
        GROUP_REQUEST_DOES_NOT_EXISTS: "Вы уже вышли из группы",
        CHANGE_EMAIL_INCORRECT_PASSWORD: "E-MAIL не был изменен, так как текущий пароль введен не верно",
        PHOTO_SIZE_OVERFLOW: " Макс. размер фото 2 МБ"
    }

    let errorMessage = null;

    for (let key in errorList) {
        if (key === messageFromServer) {
            errorMessage = errorList[key];
            return errorMessage
        }
    }

    if (errorMessage === null) {
        errorMessage = "Что-то пошло не так";
        return errorMessage
    }

}

export default errorMessageForUser