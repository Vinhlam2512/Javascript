
// Đối tượng Validator
function Validator(options)  {  //options : object cuả validate

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);     
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        // parentElement : truy ngược về thẻ cha
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid'); 
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

    // Lấy Element của form cần validate
    var formElement = document.querySelector(options.form); // options.form => form - 1

    if(formElement) { // Nếu có formElement

        options.rules.forEach(function (rule) { //Duyệt qua từng rules của object
            
            var inputElement = formElement.querySelector(rule.selector); //rule chọc vào selector của các hàm đã được định nghĩa
            // rule trả về  hàmcủa mảng đã được định nghĩa
            // inputElement là thẻ input
            if(inputElement) {
                // xử lý trường hợp blur ra khỏi input
                inputElement.onblur = function () {
                    // value : inputElement.value
                    // Test Function: rule.test
                    validate(inputElement, rule);
                }
                
                // xử lí mỗi khi người dùng nhập vào input sẽ xóa lỗi
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
        
    }

}

// Định nghĩa các rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi thì trả ra message lỗi
// 2. Khi hợp lệ thì không trả ra gì (undefined)
Validator.isRequired = function(selector) { // Selector : fullname
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    };
}

Validator.isEmail = function(selector) { // Selector : email
    return {
        selector: selector,
        test : function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;// check email
            return regex.test(value) ? undefined : 'Vui lòng nhập Email';
        }
    };
}
Validator.minLength = function(selector, min) { // Selector : password
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự` ;
        }
    };
}
Validator.isConfirmed = function(selector, getConfirmValue) {         // check pass 
    return{
        selector: selector,
        test : function (value) {
            return value === getConfirmValue() ? undefined : 'Giá trị nhập vào không chính xác';
        }
    }
}