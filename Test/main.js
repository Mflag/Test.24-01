


model = { types: [] }

view = {

	clearList: function() {
		var range = document.createRange();
		//console.log(range)
		range.selectNodeContents(document.getElementById("item"));
		range.deleteContents();
	},

	render: function() {
		
		this.clearList();	
		
		if (model.types.length != 0) {

			item = document.getElementById("item")

			for (var i = model.types.length - 1; i >= 0; i--) {
				//console.log(model.types[i])

                row = document.createElement('tr');
				type = document.createElement('td');
                state= document.createElement('td');
                erase = document.createElement('td');
				span = document.createElement('span');
				check = document.createElement('a');
				cross = document.createElement('a');
				iconCheck = document.createElement('i')
				iconCross = document.createElement('i'); 
				
				type.className = "col-6"
                state.className = "col-4"
                erase.className = "col-2"
				span.className = "item-text"
				check.className = "item-complete"
				cross.className = "item-delete" 
				
				span.textContent = model.types[i].text
				
				// Intercambiamos entre los estados
				if (model.types[i].completed) {
					span.setAttribute("style", "color: #bbb")
                    iconCheck.setAttribute("class", "far fa-check-square")  
				}
                else
                {
                    iconCheck.setAttribute("class", "far fa-square")
                }

				iconCross.setAttribute("class", "far fa-trash-alt")
				
				iconCheck.setAttribute("data-id", i)
				iconCross.setAttribute("data-id", i)
				type.setAttribute("id", "td-"+i)
				span.setAttribute("onclick", "view.changeToInput(event,'" + i + "')")
				span.setAttribute("id","span-"+i);
				check.setAttribute("onclick", "controller.completeItem('" + i + "')")
				cross.setAttribute("onclick", "controller.deleteItem('" + i + "')")

				// Estructura del item
				check.appendChild(iconCheck)
				cross.appendChild(iconCross)
				type.appendChild(span)
				state.appendChild(check)
				erase.appendChild(cross)
				row.appendChild(type);
                row.appendChild(state);
                row.appendChild(erase);
                item.appendChild(row)
			}		
		} 
	},

	addItem: function(e) {
		if ((e.code == "Enter") || (e.code == "NumpadEnter")) {
            
            item = document.getElementById("add-item").value;

			if (item.trim() != "") {
	        	controller.addItem(item);
	        	return false;	
			}
	    } 
	},
	modifyItem: function(e,index) {
		if ((e.code == "Enter") || (e.code == "NumpadEnter")) {
            
            item = document.getElementById("input-"+index).value;

			if (item.trim() != "") {
	        	controller.modifyItem(item,index);
				view.changeToSpan(item,index)
	        	return false;	
			}
	    } 
	},
	changeToInput(event,index){
		let item = document.getElementById("span-"+index)
		let text = item.textContent
		let fhater = document.getElementById("td-"+index)
		let input = document.createElement('input')
		
		fhater.removeChild(item)
		input.setAttribute("id", "input-"+index)
		input.setAttribute("value",text)
		input.setAttribute("onkeypress","view.modifyItem(event,"+index+")")
		fhater.appendChild(input)
		input.focus()
	},
	changeToSpan(value,index){
		let item = document.getElementById("input-"+index)
		let fhater = document.getElementById("td-"+index)
		let span = document.createElement('span')
		fhater.removeChild(item)
		span.setAttribute("id", "span-"+index)
		span.textContent=value
		span.setAttribute("onclick", "view.changeToInput(event,'" + index + "')")
		span.className = "item-text"
		fhater.appendChild(span)
	},

	confirmacion:function (text){
		if(confirm(text)){
			return true;
		} else{
			return false;
		}
	},
	
	filter: function(event){
		
		let option = 1
		if(event!=undefined){
			option=event.target.value
		}
		console.log(option) 
		switch(option){
			case '1':
				model.types.sort(function (x,y){
					if (x.creation < y.creation) {return -1;}
					if (x.creation > y.creation) {return 1;}
					return 0;
				})
				
				break;
			
			case '2':
				model.types.sort(function (x,y){
					if (x.creation < y.creation) {return 1;}
					if (x.creation > y.creation) {return -1;}
					return 0;
				})
				
				break;
			
			case '3':
				model.types.sort(function (x,y){
					if (x.text < y.text) {return 1;}
					if (x.text > y.text) {return -1;}
					return 0;
				})
				
				break;
			
			case '4':
				model.types.sort(function (x,y){
					if (x.text < y.text) {return -1;}
					if (x.text > y.text) {return 1;}
					return 0;
				})
				
				break;
			
			case '5':
				model.types.sort(function (x,y){
					if (x.completed < y.completed) {return 1;}
					if (x.completed > y.completed) {return -1;}
					return 0;
				})
				
				break;

			default:

				break;
		}
		//console.log(model.types)
		view.render()
		
	},
	activeModal: function(){
		modal = document.querySelector(".modal-bg-inactive");
		input = document.getElementById("add-item").focus();
		
		modal.className='modal-bg-active'
		
	},
	inactiveModal: function(){
		modal = document.querySelector(".modal-bg-active");
		modal.className='modal-bg-inactive'
	}


	
}

controller = {
	init: function() {
		view.render()
	},
	
	addItem: function(item) {
		item= item.charAt(0).toUpperCase()+ item.slice(1)
		list_item = { text: item, completed: false, creation: Date.now()}
		result = controller.findItem(list_item.text)
		console.log(result)
		if(result == false){
			model.types.push(list_item)
			//console.log(list_item)
			document.getElementById("add-item").value = ""
			document.getElementById("alert").innerHTML= ""
			view.filter()
			view.render()
		}else{
			showAlert = document.getElementById("alert")
			text = 'Este elemento ya esta agregado a lista'
			showAlert.innerHTML = text
			//document.body.insertBefore(p, modal);
			
		}
	},
	
	completeItem: function(item_index) {
		model.types[item_index].completed = !model.types[item_index].completed
		//console.log(model.types[item_index].completed)
		view.render()
	},

	deleteItem: function(item_index) {
	
		if(view.confirmacion("Desea eliminar este contrato?")){
			model.types.splice(item_index, 1)
			view.render()
		}
	},
	deleteAll: function(){
		if(view.confirmacion("Desea eliminar todos los contratos?")){
			model.types.splice(0, model.types.length)
			view.render()
		}
	},

	modifyItem: function(item, index){
		item= item.charAt(0).toUpperCase()+ item.slice(1)
		model.types[index].text= item;

		console.log(model.types)
	},

	sortBydate: function(x,y){
		if (x.creation < y.creation)
		{
			return -1;
		}
		if (x.creation > y.creation)
		{
			return -1;
		}
		return 0;
	},
	findItem: function(text){
		let result = false;

		for (let i = 0; i < model.types.length; i++) {
			let element = model.types[i];
			console.log(text)
			console.log(element)
			if(element.text == text){
				result = true
				break;
			}
			
		}
		return result
	}
	
	
}

controller.addItem("Mensual")
controller.addItem("Anual")
controller.addItem("Semestral")
controller.addItem("Trimestral")
controller.addItem("Diario")

controller.init()

