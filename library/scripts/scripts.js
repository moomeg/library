function sendShowItems(button_id, button_class) { //получаем данные для определения количества кнопок totalPages. По умолчанию данные (т.е. "на первый заход") берутся из HTML.По сути, это последняя нажатая кнопка, которая участвует в формировании информации о количестве отрисовываемых объектов на странице
    show = document.getElementById(button_id); //выбираем прожатую кнопку выбора количества объектов
    showItems = show.value;
    $.ajax({    //отправка значения количества объектов на странице для создания пейджера
        url: "includes/totalPages.php",
        type: "GET",
        method: "GET",
        data: 'showItems=' + showItems,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            paginator = document.getElementById('paginator'); //собственно, пейджер, чистим и рисуем, чистим, чтоб потом один на один не накладывался
            paginator.innerHTML = '';

            var FirstPageButton = document.createElement('button');//кнопка первой страницы, задаем атрибуты, пригодятся
            FirstPageButton.id = "first_page";
            FirstPageButton.className = "btn";
            FirstPageButton.innerHTML = "&lt&lt";
            FirstPageButton.value = "page"+ 1;
            FirstPageButton.setAttribute("onclick","endpage(this.value)");
            paginator.appendChild(FirstPageButton);
            for (i = 0; i < data.totalPages; i++) { //рисуем кнопки страниц, они взаимосвязаны с количеством отображаемых элементов, это логично
                var page = document.createElement('button');
                page.id = "page" + (i+1);
                if (i == 0) {
                    page.className = "btn btn-primary page";
                } else {
                    page.className = "btn page"
                }
                ;
                page.setAttribute("onclick","getBooks(this.id, this.className)"); // им тоже задаем атрибуты
                page.innerHTML = i + 1;
                page.value = i + 1;
                paginator.appendChild(page);
            }

            var LastPageButton = document.createElement('button'); // кнопка последней страницы
            LastPageButton.id = "last_page";
            LastPageButton.className = "btn";
            LastPageButton.innerHTML = "&gt&gt";
            LastPageButton.value = "page" + (i);
            LastPageButton.setAttribute("onclick","endpage(this.value)");
            paginator.appendChild(LastPageButton);

            getBooks(button_id,button_class); //Пейджер нарисовали, выбор количества объектов еще в HTML закончили, определим сколько объектов надо отрисовать
        }
    })
}


    function getBooks(button_id,button_class){ // Здесь рисуем книги, по ходу объясню зачем ИД и класс передавать
    var activeButtonQuantity = document.getElementsByClassName('btn btn-primary quantity'); // смена состояния кнопок выбора количества отображаемых элементов и текущей страницы
    var showItemsID = activeButtonQuantity[0].id;                                           //все вместе, так как необходимо значения количества элементов и текущей страницы отправлять в один скрипт drawPage одновременно, так как на основании комбинации состояния кнопок получаем количество объектов и их смещение
    var activeButtonPage = document.getElementsByClassName('btn btn-primary page');     //в custom.css я специально ввел два пустых класса, чтобы с их помощью разделить на группы кнопки страниц и выбора количества элементовберем инфо
    var currentPageID = activeButtonPage[0].id;                             //здесь мы берем последние активные кнопки из каждой группы (страницы и кол-во эл-тов) и сохраняем конкретно их ИД чтобы потом к ним обратиться
    var act_button = document.getElementById(button_id); //Здесь мы получаем ИД только что нажатой кнопки, пригодился и Button_ID
    if (button_class == 'btn quantity'){  //и сверяем... если только что нажатая кнопка принадлежала классу неактивных в группе выбора количества, то это значит, что мы делали выбор в группе выбора количества (в двух одновременно невозможно)
        var old_active_quantity = document.getElementById(showItemsID);//и выбираем ранее активную кнопку
        old_active_quantity.className = 'btn quantity';// и делаем ее неактивной
        act_button.className = 'btn btn-primary quantity';// а прожатую - активной (другую группу не трогаем
    };
    if (button_class == 'btn page') { // то же самое касается и проверки во второй группе, if специально разделены, ведь можно нажать еще и активную кнопку
        var old_active = document.getElementById(currentPageID);
        old_active.className = 'btn page'
        act_button.className = 'btn btn-primary page';
    }
    activeButtonQuantity = document.getElementsByClassName('btn btn-primary quantity'); //Здесь мы забираем уже новые значения активных кнопок, чтобы передать результаты (количество и смещение) в отрисовку
    showItems = activeButtonQuantity[0].value;
    activeButtonPage = document.getElementsByClassName('btn btn-primary page');
    currentPage = activeButtonPage[0].value;

    $.ajax({  //отправка значений количества записей и страницы, последующая отрисовка в главном окне
        url: "includes/drawPage.php",
        type: "GET",
        method: "GET",
        data: 'showItems=' + showItems + '&currentPage=' + currentPage,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            var bookWindow = document.getElementById('bookWindow'); //рисуем окно с книгами
            bookWindow.innerHTML = ''; // чистим от предыдущих записей
            var numeric_data = []; //мне надо было как-то отпарсить json-ответ... двумерный массив ajax обратно принять может, но понять его у меня заставить не получилось
            for(var k in data){ //в drawPage мало того что ассоциативный массив - у индексов еще числовые окончания... посему я разобрал на обычный массив
                numeric_data.push(data[k]);};
            for (i = 0; i < showItems; i++) {
                if (numeric_data[0+i*5]){//Здесь я убрал побочные эффекты такого разбора массива: если в json еще индексы были, а значения у элементов = null, то я отсеял каждый 5-й элемент (имя книги), который равнялся нулю
//условно, ответ json делился на группы из 5 элементов, в drawPage это видно, поэтому индексы numeric_data имеют такой вид
                var div = document.createElement('div') //тут пока скучно
                div.id = "book" + i;
                div.style = "clear: both; float: left; width: 750px;"
                div.className = "table-striped";
                var bookWindow = document.getElementById("bookWindow");
                bookWindow.appendChild(div);
                var table = document.createElement('table');
                div.appendChild(table);
                var tbody = document.createElement('tbody');
                table.appendChild(tbody);
                var tr1 = document.createElement('tr');
                tbody.appendChild(tr1);
                var th1 = document.createElement('th');
                th1.innerHTML = numeric_data[0+i*5] + " by " + numeric_data[3+i*5];
                tr1.appendChild(th1);
                var th2 = document.createElement('th');
                th2.innerHTML = "Synopsis";
                tr1.appendChild(th2);
                var tr2 = document.createElement('tr');
                tbody.appendChild(tr2);
                var td_rowspan2 = document.createElement('td');
                td_rowspan2.rowSpan = 2;
                tr2.appendChild(td_rowspan2);
                var bookface = document.createElement('img');
                bookface.src = numeric_data[2+i*5];
                td_rowspan2.appendChild(bookface);
                var td_synopsis = document.createElement('td');
                td_synopsis.className = "align-text-top";
                td_synopsis.innerHTML = numeric_data[4+i*5];
                tr2.appendChild(td_synopsis);
                var tr3 = document.createElement('tr');
                tbody.appendChild(tr3);
                var td_button = document.createElement('td');
                td_button.style = "width: 528px; height: 40px;";
                tr3.appendChild(td_button);
                var button = document.createElement('button');
                button.id = "email"+i;
                button.value = numeric_data[1+i*5];
                button.className = "btn btn-block btn-primary";
                button.innerHTML = "Get the Book!";
                button.setAttribute("onclick","sendtomodal(this.value)") //сразу к кнопке заказа привязываю функцию вызова модального окна на клик, и забираю линк для скачивания книги, он дальше пойдет в вызов модального окна
                td_button.appendChild(button);
                var tr4 = document.createElement('tr');
                tbody.appendChild(tr4);
                var td4 = document.createElement('td');
                td4.innerHTML = "<br><br>";
                tr4.appendChild(td4);}
            }


        }
        ,
        error: function () {
            alert("smth's wrong, AJAX had not been sent");
        }
    });
}

function endpage(page){ //поведение кнопок крайнего листа, просто эмулирует нажатие соответствующей кнопки

    var page = document.getElementById(page).click();
}


function sendtomodal(link) { //модальное окно (подрезал в интернете, в верстке не силен)

        var darkLayer = document.createElement('div'); // слой затемнения
        darkLayer.id = 'shadow'; // id чтобы подхватить стиль
        document.body.appendChild(darkLayer); // включаем затемнение

        var modalWin = document.getElementById('popupWin'); // находим наше "окно"
        modalWin.style.display = 'block'; // "включаем" его

        darkLayer.onclick = function () {  // при клике на слой затемнения все исчезнет
            darkLayer.parentNode.removeChild(darkLayer); // удаляем затемнение
            modalWin.style.display = 'none'; // делаем окно невидимым
            return false;
        }
        var button = document.getElementById('linktobook'); //передаем ссылку на скачивание в скрыттое поле в форме в модальном окне
        button.value = link;
    }

    function mailto(){ //передача данных на отправку Email, не все, но даже эти не смог... смогу эти - смогу и остальные
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var linktobook = document.getElementById('linktobook');

    $.ajax({
        url: "includes/sendEmail.php",
        type: "GET",
        method: "GET",
        data: 'name=' + name.value + '&email=' + email.value + '&linktobook=' + linktobook.value,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data.error == 1) {
                alert("Invalid E-mail!")
            }
            else {
                alert("Success!")
            }
        },
            error: function () {
                alert("Error!")
            }
        })

    }

