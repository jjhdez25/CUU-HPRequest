$(document).ready(function () {
    $('.MFGLink').on('click', function () {
        id = this.id;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                location.href = xhr.response + id;
            }
        }
        xhr.open('POST', "clParent/GetManagementReportsURL", true);
        xhr.send();

        return false;
    });
});
