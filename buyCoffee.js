document.getElementById('cardNumber').addEventListener('click', function() {
    const cardNumber = this.innerText;
    const textarea = document.createElement('textarea');
    textarea.value = cardNumber;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    // نمایش باکس کپی
    showCopyNotification();
});

function showCopyNotification() {
    const notification = document.createElement('div');
    notification.innerText = 'شماره کارت کپی شد!';
    notification.className = 'copy-notification';
    document.body.appendChild(notification);

    // حذف باکس بعد از 2 ثانیه
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}
