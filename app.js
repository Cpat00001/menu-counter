// Storage Controller

//Item Controller

const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure / State
  const data = {
    items: [
      // { id: 0, name: 'Steak Dinner', calories: 1200},
      // { id: 1, name: 'Cookies', calories: 400 },
      // { id: 2, name: 'Eggs', calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  }
  //Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      //create ID 
      if(data.items.length > 0){
          ID = data.items[data.items.length - 1].id + 1;
        } else {
          ID = 0;
        }
      
      //calories to number
      calories = parseInt(calories);

      //create new item
      newItem = new Item(ID, name, calories);

      //add to items array
      data.items.push(newItem);

      return newItem;
  },

  //getTotalCalories
    getTotalCalories: function(){
      let total = 0;
    //loop through items and add cals 
    data.items.forEach(function(item){
      total += item.calories;
    });
    //set total cal in data structure
    data.totalCalories = total;

    //return total calories
    return data.totalCalories;
    },

    logData: function(){
      return data;
    }
  }
})();
//UI Controller
const UICtrl = (function(){

  const UISelectors = {
    itemList: '#item-list',
    addBtn:'.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'

  };
  
  //Public methods
  return{
    populateItemLists: function(items){

      let html = '';

      items.forEach(function(item){
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i></a></li>
        `;
      })
      //Insert list items to layout
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    //
    getItemInput : function(){
      return{
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    //Add item to UI
    addListItem: function(item){
      //Show the list of items
       document.querySelector(UISelectors.itemList).style.display = 'block';
      //create li element
      const li = document.createElement('li');
      //add class name
      li.className = 'collection-item';
      //add id to li
      li.id = `item-${item.id}`;
      // add HTML
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i></a>
      `;
      //insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    //Clear input of submited data
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value='';
    },
    //hide line below list of dynamicly created items
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    //show total calories in UI
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    //Make UISelectors public
    getSelectors: function(){
      return UISelectors;
    }
  }
})();
// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  }
    //Add item submit
    const itemAddSubmit = function(e){
      //Get item input from UI Controler
      const input = UICtrl.getItemInput();

      //check for name and calories if inserted into form
      if(input.name !== '' && input.calories !== ''){
        //Add item
        const newItem = ItemCtrl.addItem(input.name, input.calories);
        // Add item to UI
        UICtrl.addListItem(newItem);

        //get the total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Clear field
        UICtrl.clearInput();

      }

      e.preventDefault();
    } 
  //}
  //Public Methods
  return{
    init: function(){
      //Fetch items from data structure
      const items = ItemCtrl.getItems();

      //check if any items
      if(items.length === 0){
        UICtrl.hideList();
      }else{
        //Populate list with items
        UICtrl.populateItemLists(items);
      }

      //get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);

//initialize app
App.init();
