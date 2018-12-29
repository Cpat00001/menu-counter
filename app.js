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
  //this function allows to get id 
  getItemById: function(id){
    let found = null;

    data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
    });
    return found;
  },
  setCurrentItem: function(item){
    data.currentItem = item;
  },
    getCurrentItem: function(){
      return data.currentItem;
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
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
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
    // function adds item to edit form
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    //hide line below list of dynamicly created items
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    //show total calories in UI
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    //
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
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

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);

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
    //Update item submit
  const itemUpdateSubmit = function(e){

  if(e.target.classList.contains('edit-item')){
    // Get item id(item-0, item-1)
    const listId = e.target.parentNode.parentNode.id;

    //Break into an array with slash -
    const listIdArr = listId.split('-');
    //Get actual id - you are interestedin number of id,not whole item-0 or item-1 only id number 0,1 etc
    const id = parseInt(listIdArr[1]);

    //Get item
    const itemToEdit = ItemCtrl.getItemById(id);
    //Set current item
    ItemCtrl.setCurrentItem(itemToEdit);

    // Add item to form
    UICtrl.addItemToForm();
  }
    e.preventDefault();
  }
  //Public Methods
  return{
    init: function(){

      //Clera init state / Set initial state /Call a function to hide buttons delete, edit, back
      UICtrl.clearEditState();

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
