
console.log("JS is Conected");
    
const superSheetBackground = document.getElementById("superSheetBackground");
const superSheet = document.getElementById("superSheet");
const add = document.getElementById("add"); //ADD NOTE
const select = document.getElementById("select"); //SELECT NOTE
const okNote = document.getElementById("okNote"); //OK NOTE
const cancelNote = document.getElementById("cancelNote"); //CANCEL NOTE
const trash = document.getElementById("trash"); //BORRA NOTE
const trashCategoryButton = document.getElementById("trashCategory"); //BORRA CATEGORIA
const cancel = document.getElementById("cancel"); //CANCEL SELEECION
const config = document.getElementById("config"); //ABRE AJUSTES DE NOTA
const colorContainer = document.getElementById("colorContainer"); //ABRE SELECTOR DE COLORES
const createCategoryButton = document.getElementById("addCategoryOk");
const categorylist = document.getElementById("inputList");
const categoryCreator = document.getElementById("categoryCreator");
const categorySelector = document.getElementById("categorySelector");
const checkCategory = document.getElementById("checkNewCategory");
const cancelCategory = document.getElementById("cancelNewCategory");
//const ok= document.getElementById("ok"); //CLOSE NOTE
select.addEventListener("click",showCheckbox,true);
add.addEventListener("click",showSuperNote,true);
cancelNote.addEventListener("click",closeSuperNote,true);
trash.addEventListener("click",eraseNotes,true);
cancel.addEventListener("click",cancelSelection,true);
createCategoryButton.addEventListener("click",checkCategorySelector,true);
checkCategory.addEventListener("click",saveNote, true);
cancelCategory.addEventListener("click",closeSuperNote, true);
let savedNotes =[]; // Array que almancena todas las notas creadas
let selectedNotes = []; // Array de funcionamiento parcial
let allCategories = []; // Array que almacenara las categorias creadas
let saveIdNotes=[] // alamcena los id de las notas creadas
let actualCategory =0;
//CODIGO PARA REMOVER LISTENER LLAMANDO FUNCIONES CON PARAMETRO.
Element.prototype.listenFor = function(name , callback){
    this.listenerCallback = callback;
    this.addEventListener(name,callback);
}
Element.prototype.stopListen=function(name){
    //console.log("SE DETIENE EL LISTENER");
    this.removeEventListener(name,this.listenerCallback);
}
//////////////////////////////////////PROTOTIPO OBJETO/////////////////////////////////////////////////
class category {
    constructor({
        name,
        notes=[],
    })
    {
        this.name = name;
        this.notes = notes;
        allCategories.push(this);
    }
    addNote(note){
        this.notes.push(note);
    }
}
//////////////////////////////////////PROTOTIPO OBJETO/////////////////////////////////////////////////
class notasAlmacenadas { //Prototype of Note Object
    constructor({
        tittle,
        content,
        date,
        id,
        idInput,
        color,
        category,
    }={})
    {   
        this.tittle= tittle;
        this.content= content;
        this.date= date;
        this.id = id;
        this.idInput = idInput;
        this.color = color;
        this.category = category; //NO USADO... CREO
        saveIdNotes.push(this.id); // pushea el id de la nueva nota creada
    }
    changeDate(date){
        this.date=date;
    }
    changeTittle(tittle){
        this.tittle=tittle;
    }
    changeContent(content){
        this.content=content;
    }
    changeColorNote(color){
        this.color=color;
    }
}
function colorSelector() {
    const colorPicker = document.querySelector("#colorPickerSuperSheet");
    colorPicker.style.display = "block"
    console.log("Se activa listener del ColorPicker");
    colorPicker.listenFor("input",()=>{getColorFromPicker()});
    hideTrash();
}
function getColorFromPicker(){
    const colorPicker = document.querySelector("#colorPickerSuperSheet").value;
    superSheet.style.backgroundColor = colorPicker;
    document.querySelector("#inputContent").style.backgroundColor = colorPicker;
    document.querySelector("#inputTittle").style.backgroundColor = colorPicker;
    console.log("LEEMOS COLOR: " + colorPicker);
    return colorPicker;
}
function eraseNotes(){ 
console.log("BORAR NOTAS INICIADO...");
    for(categoria in allCategories){ //ALMACENA LAS NOTAS MARCADAS
        console.log("Comprueba categoría: " + allCategories[categoria].name)
        for(notes in allCategories[categoria].notes){
            let input = document.getElementById(allCategories[categoria].notes[notes].idInput); 
            console.log("Comprueba nota: " + allCategories[categoria].notes[notes].id);
            if(input && input.checked){ 
                let idNote = allCategories[categoria].notes[notes].id;
                console.log("Esta checkeado el checkbox de la nota: " + idNote);
                console.log("Se marca la nota: " + idNote + " para eliminar");
                selectedNotes.push(allCategories[categoria].notes[notes]);
                
            } 
        }
        for(cate in allCategories){ //ELIMINA LAS NOTAS MARCADAS LOIGICA Y GRAFICAMENTE
            for(notes in allCategories[cate].notes){
                for(note in selectedNotes){
                    if(allCategories[cate].notes[notes].id == selectedNotes[note].id){
                        const idNote=allCategories[cate].notes[notes].id;
                        allCategories[cate].notes.splice(notes,1); // eliimina posicion notes[]
                        console.log("SE ELIMINA NOTA: " + idNote);
                        quitSheetsById(idNote); // elimina la nota graficamente
                    }
                    if(allCategories[categoria].notes.length != 0){
                        showSelect();
                    }else{
                        hideSelect();
                    }
                }
            }
        }
    }
    hideCheckbox();
    hideTrash();
    showAdd();
    trashCategory();
    hideCancel();
}
function cancelSelection() {
    for(cates in allCategories){
        for(notes in allCategories[cates].notes){ // REACTIVAMOS LOS LISTENERS EN TODOS LOS SHEETS
            const idNote =allCategories[cates].notes[notes].id;
            const nota=document.getElementById(idNote);
            if(nota){
                console.log("SE REACTIVAN LOS LISTENERS EN TODAS LAS NOTAS");
                nota.listenFor("click",()=>{showSuperNoteForEdit(idNote)});
            }
        }
    }
    showAdd();
    showSelect();
    hideTrash();
    hideCheckbox();
    hideCancel();
    trashCategory();
}
function detectSelect(){//AÑADE LOS LISTENERS A LOS CHECKBOX MOSTRADOS            
    for(categories in allCategories){ // colcoamos un addEventListener en cada uno de
        for(notes in allCategories[categories].notes){
            let checkboxId = allCategories[categories].notes[notes].idInput;
            let checkbox = document.getElementById(checkboxId);
            console.log("SE VERIFICA CHECKBOX: " + checkboxId);
            if(checkbox){ //verificamos que el input exista (ya q los de otras cetegorias estan ocultos)
                checkbox.addEventListener("click",showTrash,true);
                console.log("CHECKBOX " + checkboxId + " ESTA MARCADO");
            }
        }
    }
}
function showCheckbox(){ // MUESTRA LOS CHECKBOX 
    detectSelect(); // añade listeners a los checkbox
    console.log("Abrimos selectores")
    for(categories in allCategories){
        if(allCategories[categories].name == actualCategory){
            for( notes in allCategories[categories].notes){
                let idNote = allCategories[categories].notes[notes].id;
                let note = document.getElementById(idNote);
                console.log("entramos a remover evento en nota con id: " + idNote);
                note.stopListen("click", ()=>{}); // DETIENE EL LISTENER DE LA NOTA PARA EDITAR.
                let checkBoxId = allCategories[categories].notes[notes].idInput; //accedemos al id de cada checkbox
                const checkBoxOfNote= document.getElementById(checkBoxId); //accedemos al  checkbox
                console.log("entramos a verificar el input: " + checkBoxId);
                if(checkBoxOfNote){
                    checkBoxOfNote.style.display = "block"; //mostramos el checkbox
                    console.log("mostramos checkbox: " + checkBoxId);
                    console.log("pasasmos : " + (notes) + " veces");
                    if(checkBoxOfNote.checked){
                        console.log("si hay checkeados");
                        checkBoxOfNote.checked = false;// si el checkbox estaba checkeado, lo muestra desmarcado
                    }
                }
            } 
        }
    }
    add.style.display = "none";
    select. style.display = "none";
    hideTrashCategory();
    showTrash();
    showCancel();
}
function hideCheckbox(){ //ESCONDE LOS CHECKBOX
    for(categories in allCategories){
        for(notes in allCategories[categories].notes){
            let checkboxId = allCategories[categories].notes[notes].idInput;
            const checkboxOfNote= document.getElementById(checkboxId); //accedemos a cada checkBox
            if(checkboxOfNote){
                console.log("Este es el id leido por hideCheckbox: " + checkboxId);
                checkboxOfNote.style.display = "none" // activamos la visualizacion de cada uno
                console.log("ocultamos checkbox");
            }
        }
    }
}
function showSuperNote() { //ABRE LA SUPERNOTA (para crear una nota)
    let colorSuperNote = "#F7F7F7";
    console.log("ABRE INTERFAZ DE NUEVA NOTA");
    superSheetBackground.style.display = "block";
    superSheet.style.display = "block";
    categorySelector.style.display = "flex";
    categoryCreator.style.display = "none";
    categorylist.value = "";
    okNote.style.display = "none";
    superSheet.style.backgroundColor = colorSuperNote;
    const titulo = document.querySelector("#inputTittle");
    titulo.style.backgroundColor = colorSuperNote;
    const contenido = document.querySelector("#inputContent");
    contenido.style.backgroundColor = colorSuperNote;
    contenido.value = "contenido vacío"
    titulo.value = "Titulo vacío";
    contenido.value = "Contenido";
    titulo.style.setProperty('font-style', "italic");
    contenido.style.setProperty('font-style', "italic");
    contenido.style.setProperty('font-weight', "100");
    titulo.style.setProperty('font-weight', "100");
    contenido.value = "contenido";
    titulo.addEventListener("focus",hideTittle,"true");
    contenido.addEventListener("focus",hideContent,"true");

    if(allCategories.length > 0){
        const lista = document.getElementById("inputList");
        lista.value = actualCategory;
        console.log("Se le añade opcion perdeterminada a la lista");
    }
}
function saveNote(){ //Guarda la nota en el Array de notas, cierra la superNota y crea la nota
    const datos= getDatos();
    const note = new notasAlmacenadas(datos); // crea instancia de clase nota
    let categoryName = datos.category; // obtiene nombre de la categoría
    if(allCategories.length == 0){ // si no hay categorías se crea una nueva
        createCategory(categoryName , note);
    }else{
        for(categories in allCategories ){
            if (categoryName == allCategories[categories].name){
                allCategories[categories].addNote(note); // entra como objeto
                console.log("SE AÑADE NOTA: " + note.id + " A LA CATEGORÍA: " + note.category);
                break;
            }else{
                if(categories == allCategories.length - 1){
                    createCategory( categoryName , note);
                }
            }
        }
    }
    showNotesByCategory(categoryName); // muestra la nota creada de la categoria creada.
    console.log("se crea: " + datos["id"] + " el " + datos["date"]);
    document.getElementById("inputTittle").value = "";
    document.getElementById("inputContent").value = ""
    superSheetBackground.style.display = "none";
    superSheet.style.display = "none";
    select.style.display = "block";
}
function closeSuperNote(){ //CANCELA LA SUPERNOTA
    console.log("CIERRA SUPER NOTA");
    document.getElementById("superSheet").style.display = "none";
    superSheetBackground.style.display = "none";
    superSheet.style.display = "none";
    const colorPicker = document.querySelector("#colorPickerSuperSheet");
    colorPicker.stopListen("input",()=>{getColorFromPicker()}); // debemos cerrar los listener para evitar que se ejecuten doble.
    okNote.stopListen("click",()=>{editNote(idNote, categoryNote, getColorFromPicker())});
}
function getDatos() { //obtiene los datos escritos por el ususario en la superNota
    const tittle = document.querySelector("#inputTittle").value;
    const content = document.querySelector("#inputContent").value;
    const date = Date().substring(0,15); //selecciona los chars del string
    const id = "sheet_" + saveIdNotes.length;
    const idInput = "input_" + saveIdNotes.length;
    const categoryCreated = document.querySelector("#inputList").value;
    let category = "";
    let defaultColor="#F7F7F7";
    if(categoryCreated == "Crear nueva categoría"){
        category = document.querySelector("#inputCategoryName").value;
    } else {
        category =categoryCreated;
    }
    const datos = {
        tittle: tittle,
        content: content,
        date: date,
        id: id,
        idInput: idInput,
        category: category,
        color: defaultColor,
    }
    return datos;
}
function checkCategorySelector() {
    categorySelector.style.display = "none"
    if( categorylist.value == "Crear nueva categoría"){
        document.getElementById("categoryCreator").style.display = "flex";
    }else {
        saveNote();
    }
}
function hideAddCategory () {
    categorySelector.style.display = "flex"
    document.getElementById("categoryCreator").style.display = "none";
}
function createCategory(name, nota){
    new category({name}).addNote(nota); 
    createCategoryInSidebar();
    createCategoryOnList();
    console.log("CREADA CATEGORÍA: " + name);
}
function createCategoryInSidebar(){
    let categoryNameOriginal = allCategories[allCategories.length - 1].name;
    let categoryName = allCategories[allCategories.length - 1].name;
    const newCategoryDiv = document.createElement("div");
    newCategoryDiv.id = "div_" + categoryName;
    newCategoryDiv.className = "categoriesOnSidebar";
    const newDivName = document.createElement("p");
    categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1); // da el nombre de la categoría con la priumera letra en mayuscula
    newDivName.textContent = categoryName; //pone nombre div q contiene la categoría
    const currentDiv = document.getElementById("sidebar");
    currentDiv.insertAdjacentElement("beforeend",newCategoryDiv);
    newCategoryDiv.insertAdjacentElement("beforeend",newDivName);
    console.log("SE AÑADE AL SIDEBAR CATEGORÍA: " + categoryName);
    newCategoryDiv.addEventListener("click",function(){showNotesByCategory(categoryNameOriginal)},true);
    //se añade una funcion con PARAMETRO al evento de cada nuevo Div de categoria creado
}
function eraseCategory(categoryName){
    for(cate in allCategories){
        if(allCategories[cate].name == categoryName){
            allCategories.splice(cate,1);
            console.log("SE ELEMINA CATEGORÍA : " + categoryName);
        }
    }
    if(allCategories.length >0){
        showNotesByCategory(allCategories[0].name);
    }else{
        trashCategory(); // si no hay categorias oculta el trashCategory
        quitSheets();
        hideSelect();
    }
    const divId = "div_" + categoryName
    const divCategory = document.getElementById(divId);
    divCategory.remove();
}
//  ERROR ELIMINAR CATEOGRIAS EN EL SELECTOR DE LISTA!!!!!!!!!!!!!!!!!!!!!!
function createCategoryOnList(){
    let categoryName = allCategories[allCategories.length - 1].name;
    const list = document.getElementById("lista");
    const optionValue = document.createElement("option");
    optionValue.value = categoryName;
    list.insertAdjacentElement("beforeend",optionValue);
    document.querySelector("#inputCategoryName").value = "";
    categorylist.value = "";
    console.log( "SE AGREGA CATEGORÍA: " + categoryName + " AL SELECTOR DE CLASES CREADAS");
    hideAddCategory();
}
function showNotesByCategory(category){ 
    highlightCategoryOnSidebar(category);
    console.log("SE MUESTRAN LAS NOTAS DE LA CATEGORÍA: " + category);
    quitSheets();
    for (categories in allCategories){ 
        if(allCategories[categories].name == category){
            for(notes in allCategories[categories].notes){ 
                let nota = allCategories[categories].notes[notes];
                addSheet(nota);
                let cont= notes;
                cont=parseInt(cont);
                console.log("SE MUESTRAN " + cont + " NOTAS");
            }
            if(allCategories[categories].notes.length != 0){
                showSelect();
            }else{
                hideSelect();
            }
        }
    }
    trashCategoryButton.stopListen("click"); //REMUEVE EL LISTENER ANTERIORMENTE CREADO
    console.log("SE REMUEVE EL LISTENER DEL TRASHCATEGORY");
    trashCategoryButton.listenFor("click", ()=>{eraseCategory(category)});
    console.log("SE AÑADE NUEVO LISTENER PARA EL TRASH EN: " + category);
    trashCategory();
    hideCancel();
    actualCategory = category;
    
}
function quitSheetsById(id) { //Elimina notas por id
    const sheet = document.getElementById(id);
    if(sheet){
        sheet.remove();
        console.log("SE ELIMINA DE LA PANTALLA LA NOTA: " + id);
    }
}
function quitSheets() { //Elimina todas las notas
    const sheetsContainer = document.getElementById("sheetsContainer");
    while (sheetsContainer.firstChild) {
        sheetsContainer.removeChild(sheetsContainer.firstChild);
    }
}
function addSheet(nota){ // crea una sola nota 
    const newDiv = document.createElement("div");
    const newTittle = document.createElement("h4")
    const newInput = document.createElement("input");
    const newContent = document.createElement("p");
    const newDate = document.createElement("p");
    newDiv.className = "sheets";
    newDiv.id = nota["id"]; // accede a la propiedad "id" del objeto nota.
    const idNote=nota["id"];
    const categoryNote = nota["category"];
    console.log("SE OBTIENE CATEGORY: " + categoryNote);
    newInput.className = "checkList";
    newInput.id = nota["idInput"];
    newInput.type = "checkbox";
    newTittle.textContent = nota["tittle"];
    newContent.textContent = nota["content"];
    newDate.textContent = nota["date"];
    const currentDiv = document.querySelector("#sheetsContainer");
    currentDiv.insertAdjacentElement("beforeend",newDiv);
    newDiv.insertAdjacentElement("beforeend",newTittle);
    newDiv.insertAdjacentElement("beforeend",newInput);
    newDiv.insertAdjacentElement("beforeend",newContent);
    newDiv.insertAdjacentElement("beforeend",newDate);
    newDiv.style.backgroundColor = nota["color"];    
    console.log("SE DIBUJA LA NOTA: " + idNote);
    console.log("ACTIVAMOS LISTENER DE LA NOTA: " + nota["id"]);
    newDiv.listenFor("click",()=>{showSuperNoteForEdit(idNote,categoryNote)});
    //newDiv.removeEventListener("click",function(){showSuperNoteForEdit(idNote)},false);
}
function showSuperNoteForEdit(idNote, categoryNote){
        const titulo = document.querySelector("#inputTittle");
        const contenido = document.querySelector("#inputContent");
        titulo.removeEventListener("focus",hideTittle,"true");
        contenido.removeEventListener("focus",hideContent,"true");
        const noteDatos = getDatosFromNoteById(idNote);
        console.log("ABRE EDICION DE LA NOTA: " + idNote);
        let noteTittle = noteDatos.tittle; // trae la informacion q tenia la nota
        let noteContent = noteDatos.content;
        console.log("SE MUESTRA PARA EDITAR: Titulo: " + noteTittle + " Contenido: " + noteContent);
        const superSheetTittle = document.querySelector("#inputTittle");
        const superSheetContent = document.querySelector("#inputContent");
        console.log("EL COLOR PARA EDITAR LA NOTA ES: " + noteDatos.color);
        superSheetTittle.value = noteTittle; // SE LE DA EL TITULO A LA SUPERSHEET DE EDICION
        superSheetContent.value = noteContent;
        cancelNote.style.display = "flex";
        okNote.style.display = "flex";
        showColorPickerInSuperSheet(idNote,categoryNote);
        superSheetBackground.style.display = "block";
        superSheet.style.display = "block";
        categorySelector.style.display = "none";
        categoryCreator.style.display = "none";
        categorylist.value = "";
        colorSelector(idNote,categoryNote);
        console.log("Se activa listener del botón check");
        okNote.listenFor("click",()=>{editNote(idNote, categoryNote, getColorFromPicker())});
}
function noteByIdAndCategory(idNote, categoryNote){
    let note= "";
    let noteForDom="";
    for( cates in allCategories){
        if(allCategories[cates].name == categoryNote){
            for (notes in allCategories[cates].notes){
                if(allCategories[cates].notes[notes].id == idNote){
                    note = allCategories[cates].notes[notes];
                    let idNote=allCategories[cates].notes[notes].id
                    noteForDom = document.getElementById(idNote);
                }
            }   
        }
    }
    const nota={
        object: note,
        element:noteForDom,
    }
    return nota;
}
function editNote(idNote, categoryNote, colorOfPicker){
    hideColorPickerInSuperSheet();
    console.log("SE EDITA CON id: " + idNote +  " Y category: " + categoryNote);
    const notaDatos=getDatos(); // datos del supersheet de edicion.
    const titleSupersheet = notaDatos.tittle;
    const contentSupersheet = notaDatos.content;
    const note = noteByIdAndCategory(idNote,categoryNote);
    note.object.changeTittle(titleSupersheet);
    let newTittle= note.object.tittle;
    note.object.changeContent(contentSupersheet);
    let newContent=note.object.content;
    console.log("SE GUARDA NUEVA INFORMACIÓN:  Titulo: " + newTittle + " Y Contenido: " + newContent);
    note.element.stopListen("click");
    note.object.changeColorNote(colorOfPicker);
    console.log("GUARDAMOS NUEVO COLOR: " + colorOfPicker + " PARA LA NOTA: " + idNote);
    console.log("Detenemos listener de la nota: " + idNote);
    console.log(note.object);
    showNotesByCategory(note.object.category);
    okNote.stopListen("click",()=>{editNote(idNote, categoryNote)});
    closeSuperNote();
}// EL ERROR ESTA CUANDO ENTRO A CAM BIAR COLOR DE 
//LA NOTA Y AL FINAL NO LO HAGO
function showColorPickerInSuperSheet(idNote,categoryNote){
    const note = noteByIdAndCategory(idNote,categoryNote);
    console.log(note);
    let color = note.object.color;
    console.log(color);
    console.log("Colorpicker inicia de color: " + color);
    const colorpickerDiv = document.getElementById("colorPickerContainer");
    const colorpicker = document.getElementById("colorPickerSuperSheet");
    colorpickerDiv.style.display = "block";
    colorpicker.value = color;
    const superSheetTittle = document.querySelector("#inputTittle");
    const superSheetContent = document.querySelector("#inputContent");
    console.log("EL COLOR PARA EDITAR LA NOTA ES: " + color);
    superSheet.style.backgroundColor = color;
    superSheetTittle.style.backgroundColor = color;
    superSheetContent.style.backgroundColor=color;
}
function hideColorPickerInSuperSheet(){
    const colorpicker = document.getElementById("colorPickerContainer");
    colorpicker.style.display = "none";
}
function highlightCategoryOnSidebar(categoryName){
    for(cates in allCategories){
        let idOtherCategoryDiv = "div_" + allCategories[cates].name;
        let otherCategory =  document.getElementById(idOtherCategoryDiv);
        otherCategory.style.backgroundColor = "white";
        otherCategory.style.color = "#7FB5FF";
        otherCategory.style.setProperty("width", "calc( 100% + 1px)");
    }
    let idCategoryDiv = "div_" + categoryName;
    let categoryDiv = document.getElementById(idCategoryDiv);
    categoryDiv.style.backgroundColor="#2D2D2D";
    categoryDiv.style.setProperty("border-right","1px  solid #2D2D2D");
    categoryDiv.style.color="#FFFFFF";
}
function getDatosFromNoteById(idNote){
    let noteTittle = "";
    let noteContent = "";
    let noteDate = "";
    let noteId = "";
    let noteIdInput = "";
    let noteCategory = ""
    for(cates in allCategories){
        for(notes in allCategories[cates].notes){
            if(allCategories[cates].notes[notes].id == idNote){
                let nota = allCategories[cates].notes[notes];
                noteTittle = nota.tittle;
                noteContent = nota.content;
                noteDate = nota.Date;
                noteIdInput = nota.idInput;
                noteCategory = nota.category;
                noteColor = nota.color;
            }
        }
    }
    const datos = {
        tittle: noteTittle,
        content: noteContent,
        date: noteDate,
        id: noteId,
        idInput: noteIdInput,
        category: noteCategory,
        color:noteColor,
    }
    return datos;
}
function hideTittle(){
    const titulo = document.querySelector("#inputTittle");
    const contenido = document.querySelector("#inputContent");
    titulo.value= "";
    titulo.style.setProperty('font-style', "normal");
    titulo.style.setProperty('font-weight', "400");
    titulo.removeEventListener("click",hideTittle,"false");
    if(contenido.value == ""){
        contenido.value="Contenido vacío";
        contenido.style.setProperty('font-style', "italic");
        contenido.style.setProperty('font-weight', "100");
        contenido.addEventListener("click",hideContent,"true");
    }
}
function hideContent(){
    const titulo = document.querySelector("#inputTittle");
    const contenido = document.querySelector("#inputContent");
    contenido.value= "";
    contenido.style.setProperty('font-style', "normal");
    contenido.style.setProperty('font-weight', "100");
    contenido.removeEventListener("click",hideContent,"true");
    if(titulo.value == ""){
        titulo.value="Titulo vacío";
        titulo.style.setProperty('font-style', "italic");
        titulo.style.setProperty('font-weight', "100");
        titulo.addEventListener("click",hideTittle,"true");
    }
}
function showTrash () {
    console.log("se activa la papelera");
    trash.style.display = "flex";
}
function hideTrash () {
    trash.style.display = "none"
}
function trashCategory(){
    if(allCategories.length > 0){
        console.log("Se activa trash category");
        trashCategoryButton.style.display="flex";
    }else{
        console.log("se oculta trasCategory");
        trashCategoryButton.style.display="none";
    }
}
function hideTrashCategory(){
    console.log("Se oculta trash category");
    trashCategoryButton.style.display="none";
}
function showSelect () {
    select.style.display = "block"
}
function hideSelect () {
    select.style.display = "none"
}
function showAdd () {
    add.style.display = "block"
}
function hideAdd () {
    add.style.display = "none"
}
function showCancel(){
    cancel.style.display="block";
}
function hideCancel(){
    cancel.style.display="none";
}