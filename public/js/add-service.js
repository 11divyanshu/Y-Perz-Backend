// JavaScript for label effects only
$(window).load(function(){
    $(".col-3 input").val("");
    
    $(".input-effect input").focusout(function(){
        if($(this).val() != ""){
            $(this).addClass("has-content");
        }else{
            $(this).removeClass("has-content");
        }
    })
});

function handleModalToggle(){
    let item = document.getElementById('confimation_modal_id');
    if(item.classList[1] === "d-flex"){
        item.classList.remove('d-flex');
        item.classList.add('d-none');
    }else{
        item.classList.remove('d-none');
        item.classList.add('d-flex');
    }
}