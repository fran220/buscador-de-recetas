function iniciarAPP(){

    const resultado = document.querySelector('#resultado1');
    const resultadoFav = document.querySelector('#resultado2');
    const select = document.querySelector('#opcion');

    if(select){
        obtenerCategoria();
        select.addEventListener('change', obtenerRecetas);
    }

    mostrarFavoritos();


    //select
    function obtenerCategoria(){
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

        fetch(url)
            .then(res => res.json())
            .then(cat => mostrarCategorias(cat.categories))
            .catch(err => console.log(err))
    }

    function mostrarCategorias(categoria){
        categoria.forEach(cat => {
            const option = document.createElement('option');
            option.textContent = cat.strCategory;
            option.value = cat.strCategory;
            select.appendChild(option);
        });
    }

    //card recetas
    function obtenerRecetas(e){
        const categoria = e.target.value;

        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

        fetch(url)
            .then(res => res.json())
            .then(cat =>{
                limpiarHtml(resultado);
                mostrarRecetas(cat.meals)
            })
            .catch(err => console.log(err))
    }

    function mostrarRecetas(recetas){

        for(let i=0;i<recetas.length;i++){
            const{idMeal, strMeal, strMealThumb} = recetas[i];

            const card = document.createElement('div');
            const imgCard = document.createElement('img');
            const h2Card = document.createElement('h2');
            const divBtn = document.createElement('div');
            const btn = document.createElement('button');

            card.classList.add('card');

            imgCard.src = `${strMealThumb}`;
            imgCard.alt = `imagen de la comida`;

            h2Card.textContent = strMeal;

            divBtn.classList.add('divBoton');
            btn.classList.add(`boton`);
            btn.id = `${idMeal}`;
            btn.textContent = `Ver Receta`;

            divBtn.appendChild(btn);
            card.appendChild(imgCard);
            card.appendChild(h2Card);
            card.appendChild(divBtn);
            resultado.appendChild(card);
        }

        const btn = document.querySelectorAll('.boton'); 
        btn.forEach(btn =>{
            btn.addEventListener('click', extraerReceta)
        })
    }

    //modal
    function extraerReceta(e){
        const id = e.target.id;
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        fetch(url)
            .then(res=>res.json())
            .then(receta => mostrarModal(receta.meals[0]))
            .catch(err=>console.log(err));
    }

    function mostrarModal(objReceta){
        const contenedor = document.querySelector('.contenedor-modal')
        const titulo = document.querySelector('.titulo');
        const modalCard = document.querySelector('.contenedor-card');
        const contenedorBtn = document.querySelector('.botones');
        const {idMeal, strInstructions, strMeal, strMealThumb, strYoutube} = objReceta;
        limpiarHtml(titulo);
        limpiarHtml(modalCard);
        limpiarHtml(contenedorBtn);

        //creo los elementos
        const nameFood = document.createElement('h1'); 
        const imgCard = document.createElement('img');
        const divIngredientes = document.createElement('div');
        const tituloIng = document.createElement('h2');
        const ulCard = document.createElement('ul');
        const divInstrucciones = document.createElement('div');
        const tituloInst = document.createElement('h2');
        const textCard = document.createElement('p');
        const btnFav = document.createElement('button');
        const btnClose = document.createElement('button');
        
        //agreo sus contenido
        nameFood.textContent = strMeal;
        divIngredientes.classList.add('ingredientes');
        divInstrucciones.classList.add('instrucciones');
        tituloIng.textContent = "Ingredientes";
        tituloInst.textContent = "Instrucciones";
        imgCard.src = strMealThumb;
        imgCard.alt = `image the food ${strMeal}`;
        textCard.textContent = strInstructions;
        btnFav.classList.add('btn-fav');
        btnFav.textContent = existeLocalStorage(idMeal) ? "Eliminar" : "Favorito";
        btnClose.classList.add('btn-cerrar');
        btnClose.textContent = "Cerrar";
    
        //uniendo todo
        titulo.appendChild(nameFood);

        modalCard.appendChild(imgCard);
        
        for(let i=0;i<=20;i++){
            if(objReceta[`strIngredient${i}`]){
                const ingrediente = objReceta[`strIngredient${i}`];
                const cantidad = objReceta[`strMeasure${i}`];

                const li = document.createElement('li');
                li.textContent = `${ingrediente} - ${cantidad}`;
                ulCard.appendChild(li);
            }
        }

        divIngredientes.appendChild(tituloIng);
        divIngredientes.appendChild(ulCard);
        divInstrucciones.appendChild(tituloInst);
        divInstrucciones.appendChild(textCard);
        modalCard.appendChild(divIngredientes);
        modalCard.appendChild(divInstrucciones);


        btnFav.addEventListener('click', ()=>{
            if(existeLocalStorage(idMeal)){
                eliminarLocalStorage(idMeal);
                btnFav.textContent = "Favorito";
                alert("Se elimino correctamente");
                return
            }

            agregaLocalStorage({
                id: idMeal,
                nombre: strMeal,
                img: strMealThumb
            });
            btnFav.textContent = "Eliminar";
            alert("Se agrego correctamente");

        })

        btnClose.addEventListener('click', ()=>{
            contenedor.classList.remove('show');
        })

        contenedorBtn.appendChild(btnFav);
        contenedorBtn.appendChild(btnClose);

        contenedor.classList.add('show');
        
        
    }

    //funciones 
    function agregaLocalStorage(obj){
        const fav = JSON.parse( localStorage.getItem("favorito") ) ?? [];
        localStorage.setItem('favorito', JSON.stringify([...fav, obj]));
        
    }

    function eliminarLocalStorage(id){
        const fav = JSON.parse(localStorage.getItem('favorito'))
        const newFav = fav.filter(favorito => favorito.id !== id);
        localStorage.setItem('favorito', JSON.stringify(newFav));
    }

    function existeLocalStorage(id){
        const fav = JSON.parse( localStorage.getItem("favorito")) ?? [];
        return fav.some(fav => fav.id === id);
    }

    function mostrarFavoritos(){

        const favoritos = JSON.parse(localStorage.getItem("favorito")) ?? [];
        favoritos.forEach(fav => {
            const {nombre, id, img} = fav;
            const cardFav = document.createElement('div');
            const imgFav = document.createElement('img');
            const tituloFav = document.createElement('h2');
            const divBtn = document.createElement('div');
            const btnEliminar = document.createElement('button');

            cardFav.classList.add('card');
            divBtn.classList.add('divBoton');

            tituloFav.textContent = nombre;
            imgFav.src = `${img}`;
            imgFav.alt =`imagen de la receta ${nombre}`;
            btnEliminar.textContent = "Eliminar";    
           
            btnEliminar.addEventListener('click', ()=>{
                eliminarLocalStorage(id);
            })

            cardFav.appendChild(imgFav);
            cardFav.appendChild(tituloFav);
            divBtn.appendChild(btnEliminar);
            cardFav.appendChild(divBtn);
            resultadoFav.appendChild(cardFav);

        });
    }

    function limpiarHtml(variable){
        while(variable.firstChild) {
            variable.removeChild(variable.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', iniciarAPP);