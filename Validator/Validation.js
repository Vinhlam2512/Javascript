


// Đối tượng Validator
function Validator(options)  {  //options : object cuả validate


    function getParent(element, selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            var element = element.parentElement;
        }
    }

    var selectorRules = {}; // selectorRules is object rỗng

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
         
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;  

        // Lấy ra các rules của selector add vào object
        var rules = selectorRules[rule.selector]
      
        // console.log( rule.selector)
        
        // Lặp qua từng rules và kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for( var i = 0; i < rules.length; i++){
            switch(inputElement.type){
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )

                break;

                default:
                    errorMessage = rules[i](inputElement.value) //// value : inputElement.value // rules[i] = rule.test
            }
            
            if(errorMessage) break;
        }

        // parentElement : truy ngược về thẻ cha
        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid'); 
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy Element của form cần validate
    var formElement = document.querySelector(options.form); // options.form => form - 1
    
    if(formElement) { // Nếu có formElement

        // khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rules và validator
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
              
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });

            if(isFormValid) {
                // Trường hợp submit with JS
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]'); // take value of field with attribute is name
                    // console.log(Array.from(enableInputs));
                    var formValues = Array.from(enableInputs).reduce(function (values, input) { // convert sang Array to use Reduce to take value in input  
                        
                        switch(input.type){
                            case 'radio':
                            case 'checkbox':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;

                                break;

                            default:
                                values[input.name] = input.value;
                        }

                        return  values; // input chạy từ phần tử 0 , values[] push element to object
                    }, {}); // values trong lần chạy thứ nhất là 1 object rỗng => push value of input vào object // {} giá trị khởi tạo
                    options.onSubmit(formValues); // callback formValues
                }
                // trường hợp submit với hành vi mặc định
                else{
                    // Submit với hành vi mặc định của trình duyệt
                    formElement.submit();
                }
               
            } 
        }

        // Lặp qua mỗi rule và xử lí các sự kiện
        options.rules.forEach(function (rule) { //Duyệt qua từng rules của object
            
            // Lưu lại các rules cho mỗi input vào selectorRules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            
            var inputElements = formElement.querySelectorAll(rule.selector); //rule chọc vào selector của các hàm đã được định nghĩa

            // rule trả về  hàm của mảng đã được định nghĩa
            // inputElement là thẻ input
            Array.from(inputElements).forEach( function (inputElement){
                // xử lý trường hợp blur ra khỏi input
                inputElement.onblur = function () {
                 
                    // Test Function: rule.test
                    validate(inputElement, rule);
                }
                
                // xử lí mỗi khi người dùng nhập vào input sẽ xóa lỗi
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            })
        });
    }

}

// Định nghĩa các rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi thì trả ra message lỗi
// 2. Khi hợp lệ thì không trả ra gì (undefined)
Validator.isRequired = function(selector, message) { // Selector : fullname
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui lòng nhập trường này'
        }
    };
}

Validator.isEmail = function(selector, message) { // Selector : email
    return {
        selector: selector,
        test : function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;// check email
            return regex.test(value) ? undefined : message || 'Vui lòng nhập Email';
        }
    };
}
Validator.minLength = function(selector, min, message) { // Selector : password
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự` ;
        }
    };
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {         // check pass 
    return{
        selector: selector,
        test : function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}
