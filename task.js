// first we will select all the elements , that are needed in js 

// elements of add task section , form 
const task_form = document.querySelector('#task_form') ;
const task_title_input = document.querySelector('#task_title') ;
const task_desc_input = document.querySelector('#task_desc') ;
const task_priority_input = document.querySelector('#task_priority') ;
const task_due_date_input = document.querySelector('#due_date') ;
const task_title_error_input = document.querySelector('#title_error') ;
const task_clear_form_button_input = document.querySelector('#clear_form_button') ;


// elements of dashboard section 

const task_list = document.querySelector('#task_list') ; // the unordered list , where li will go 
const empty_state = document.querySelector('#empty_state') ;
const filter_buttons = document.querySelectorAll('.filter_button') ; // this will return node list
const search_input = document.querySelector('#search') ;
const badge_task_count = document.querySelector('#badge_task_count') ;


// elements of stat section 


const total_count_stat = document.querySelector('#total_count') ;
const completed_count_stat = document.querySelector('#completed') ;
const pending_count_stat = document.querySelector('#pending') ;
const high_priority_count_stat = document.querySelector('#high_priority') ;

const progress_bar_fill = document.querySelector('#progress-bar') ;
const progress_percent_stat = document.querySelector('#progress_percent') ;

// notification elements

const notification = document.querySelector('#notification');
const notification_msg = document.querySelector('#notification_msg');

//  popup elements 

const popup_background = document.querySelector('#popup_background');
const popup_close_btn = document.querySelector('#popup_close_btn');

const cancel_edit_button = document.querySelector('#cancel_edit_button');

const save_edit_button = document.querySelector('#save_edit_button');

const editTaskIdInput = document.querySelector('#edit-task-id'); // hidden input


const edit_task_title = document.querySelector('#edit_task_title');
const edit_task_desc = document.querySelector('#edit_task_desc');

const edit_task_priority = document.querySelector('#edit_task_priority');
const edit_due_date = document.querySelector('#edit_due_date');

// dark mode
const color_change = document.querySelector('#color_mode') ;
// current state 

// if some data is stored we load it , otherwise start empty

 let tasks = load_data_from_local_storage() ;

 let current_filter = 'all' ; // all pending completed

 let current_search = '' ; // users current search 


// storage functions

function save_to_local_storage()
{
    const tasks_as_strings = JSON.stringify(tasks) ;
    localStorage.setItem('task_flow' , tasks_as_strings) ; // key value pair

}

function load_data_from_local_storage(){

    data = localStorage.getItem('task_flow') ;

    if(data === null) return [] ;

    // coverts string back to array
    return JSON.parse(data) ;

}

// function for generating unique id

function generate_id(){
    return Date.now() ;
}


// diplaying task 
// it builds tasks list

function render_task(){

    // get the tasks which mathes the filter

    let filtered_task = tasks.filter(function(task){

        if(current_filter === 'all') return true ;

        if(current_filter === 'completed')
        {
            if(task.completed === true) return true ;
            return false ;
        }

        if(current_filter === 'pending')
        {
            if(task.completed === false) return true ;
            return false
        }
    });

    // again filter the tasks according to the search bar

    if(current_search.length > 0)
    {
        filtered_task = filtered_task.filter(function(task){

            
            const a = task.title.toLowerCase().includes(current_search.toLowerCase()); 
             const b = task.desc.toLowerCase().includes(current_search.toLowerCase()); 

            return a || b ;
        })
    }

    // clear the list 
    task_list.innerHTML = '' ;

    // show empty symbol , if their is no task to show 
    if(filtered_task.length > 0)
    {
        empty_state.style.display = 'none' ;

    }
    else 
         empty_state.style.display = 'block' ;

    // crete element for each task and appened it the list 
    filtered_task.forEach(function(task){

        const ele = create_task_element(task) ;

        task_list.appendChild(ele) ;
    })

    // update the statistics section 
    update_stats() ;


}

// making of task list element 

function create_task_element(task){

    const li = document.createElement('li') ;

    // add css class to the li item
    li.classList.add('task-item'); 

    // adding priority class
    li.classList.add('priority-' + task.priority) ;


    // if the task is completed add completed class
    if(task.completed === true)
    {

        li.classList.add('completed') ;
    }


    // adding animation class
    li.classList.add('new-task') ;

    // attaching unique id

    li.setAttribute('data-id' , task.id) ;

    let due_date_html = '' ;
    if(task.dueDate){
        due_date_html = `<span class="task-due-date">📅 ${formatDate(task.dueDate)}</span>` ;
    }

    let desc_html= '' ;
    if(task.desc){
        desc_html = `<p class="task-desc">${task.desc}</p>` ;
    }

    li.innerHTML = `
    <input 
    type="checkbox" 
    class="task-checkbox"
    ${task.completed ? 'checked' : ''}
    aria-label="Mark Task as complete"
    />
    <div class="task-body">
        <p class="task-title">${task.title}</p>
        ${desc_html}
        <div class="task-meta">
            <span class="task-priority-badge ${task.priority}">${task.priority}</span>
            ${due_date_html}
        </div>
    </div> 
    <div class="task-actions">
        <button class="task-btn edit-btn" title="Edit task">✏️</button>
        <button class="task-btn delete-btn" title="Delete task">🗑️</button>
    </div>` ;


    return li ;
    
    
}

// function for formatting date

function formatDate(datestring){

    const date = new Date( datestring + 'T00:00:00') ;
    return date.toLocaleDateString('en-US' , {
        month:'short',
        day:'numeric',
        year:'numeric'
    })

}

// updating the stats section 

function update_stats(){

    // completed count 
    const completed_count = tasks.filter( function(task){
        return task.completed === true ;
    }  ).length ;


    // pending count 
    const pending = tasks.filter( function(task){
        return task.completed === false ;
     }).length ;

     //count high priority task
     const high_count = tasks.filter( function(task){
        return task.priority === 'high' ;
     }).length ;

     const total = tasks.length ;


      total_count_stat.textContent = total ;
    completed_count_stat.textContent = completed_count ;
     pending_count_stat.textContent = pending ;
     high_priority_count_stat.textContent = high_count ;

     badge_task_count.textContent = pending + ' task' ;

     // percentage ;

     let percentage = 0 ;
     if(total > 0 )
     {
        percentage = Math.round((completed_count / total)* 100) ;

     }

     progress_bar_fill.style.width = percentage + '%' ;
     progress_percent_stat.textContent = percentage + '%' ;
}


// function showing notification 

function show_notification(message){
    notification_msg.textContent = message ;

    // add class for showing 
    notification.classList.add('show') ;

    setTimeout( function(){
        notification.classList.remove('show') ;
    },2500);
}


// opening and closing modal 

function open_popup(task){

    
 editTaskIdInput.value = task.id ; 


 edit_task_title.value = task.title ;
 edit_task_desc.value = task.desc ;

 edit_task_priority.value = task.priority ;
 edit_due_date.value = task.dueDate ;

 // add an active class 
 popup_background.classList.add('active') ;

}

function close_popup(){

    popup_background.classList.remove('active') ;
}


// adding event listeners

// event listener for form , when add task is clicked


task_form.addEventListener('submit' ,function(event){
    event.preventDefault() ;

    const title = task_title_input.value.trim() ;
    const desc = task_desc_input.value.trim() ;
    const priority = task_priority_input.value ;
    const duedate = task_due_date_input.value ;

    // if title is empty
    if(title == '')
    {
        task_title_error_input.textContent = "Please enter a task title." ;
        task_title_input.focus() ;
        return ;
    }


    // clear the privious text error content 
    task_title_error_input.textContent = '' ;

    // make an object of new task
    const new_task = {
        id: generate_id() ,
        title : title ,
        desc : desc ,
        priority : priority ,
        dueDate : duedate ,
        completed : false ,
        createdAt: new Date().toISOString()  // timestamp
    }

    // add the task on the top 
    tasks.unshift(new_task) ;

    // save it local storage

    save_to_local_storage() ;

    render_task() ;

    show_notification('✅ Task added successfully!') ;

    task_form.reset() ;


})

// when clicked on clear form button 

task_clear_form_button_input.addEventListener('click' , function(event){

    task_form.reset() ;
    task_title_error_input.textContent = '' ;
})

// filter buttons 
// looping through all 3 filter button 


filter_buttons.forEach(function(btn){

    btn.addEventListener('click' , function(){


        // first remove the active class from all filter
        filter_buttons.forEach(function(b){
            b.classList.remove('active') ;
        })

        // adding active class to the filter which was clicked
        btn.classList.add('active') ;

        current_filter = btn.getAttribute('data-filter') ;

        render_task() ;

    })
});

// event listener  on search input 

search_input.addEventListener('input', function(){

    current_search = search_input.value.trim() ;

    render_task() ;
})

// escape key should close the popup

document.addEventListener('keydown' , function(event){
    if(event.key === 'Escape') close_popup() ;
})


// event listener on the tasl list

task_list.addEventListener('click' , function(event){


    const clickedEl = event.target ;

    const task_li = clickedEl.closest('.task-item');

    if(task_li == null) return ;

    // get the task id 
    const taskId = Number(task_li.getAttribute('data-id')) ;

    // check if the clicked elemnet is checkbox 
    if(clickedEl.classList.contains('task-checkbox')){
        // retrive the task form the array 

        const task = tasks.find(function(t){
            return t.id === taskId ;
        })

      if(task){
          task.completed = !task.completed ;

        save_to_local_storage() ;
        render_task() ;

        if(task.completed)
        {
            show_notification('🎉 Task marked as complete!');
        }
        else 
            show_notification('🔄 Task marked as pending.') ;
      }


    }


    // check if the clicked element is delete box
    if(clickedEl.classList.contains('delete-btn'))
    {
        // add the "removing" class for animation
        task_li.classList.add('removing') ;


        // let animation finish and then remove the  element
        setTimeout(function(){

            tasks = tasks.filter(function(t){
                return t.id !== taskId ;
            })

            save_to_local_storage() ;
            render_task();

            show_notification('🗑️ task deleted') ;
        },1000);


    }


    //if clicked element is edit button 
     if(clickedEl.classList.contains('edit-btn')){
        const task = tasks.find(function(t){
          return  t.id === taskId ;
        })

        if(task){
            open_popup(task) ;
        }
     }



})


// clsing the popup 

popup_close_btn.addEventListener('click', function(){
    close_popup() ;
})

cancel_edit_button.addEventListener('click', function(){
    close_popup() ;
})


// closing the popup , if clicked outside
popup_background.addEventListener('click' , function(event){
    if(event.target === popup_background) close_popup() ;
})

// save button 
save_edit_button.addEventListener('click', function(){

    // hidden input 
    const taskid = Number(editTaskIdInput.value) ;

    const new_title = edit_task_title.value.trim() ;

    if(new_title == ''){
        edit_task_title.style.borderColor = 'var(--color-danger)' ;
        edit_task_title.focus() ;
        return ;
    }

     edit_task_title.style.borderColor = '' ;

     tasks.forEach(function(task, index)
     {
        if(task.id === taskid)
        {
            tasks[index].title  =  new_title ;
            tasks[index].desc = edit_task_desc.value.trim() ;
            tasks[index].priority = edit_task_priority.value ;
            tasks[index].dueDate = edit_due_date.value ;
        }
     }) ;

     save_to_local_storage() ;
     render_task() ;
     close_popup() ;
     show_notification('✏️ Task updated!') ;

}) ;

// clock function 

function update_clock(){
    const time = new Date() ;

    const pend_ing = tasks.filter(function(t){

        if(t.completed === false) return true ;

    }).length;

    if(pend_ing === 0){
        const timestr = time.toLocaleTimeString('en-US', {
            hour : '2-digit' ,
            minute:'2-digit'
        })
        badge_task_count.textContent = '⏰ ' + timestr ;
    }
}

setInterval(function(){
    update_clock() ;
} , 1000) ;


task_title_input.addEventListener('input' , function(){
    if(task_title_input.value.trim().length > 0) task_title_error_input.textContent = '' ;
});


color_change.addEventListener('click' , function(){

    const ele = document.getElementById('body') ;
    const top = document.getElementsByClassName('website_header') ;
    if(color_change.textContent == 'Dark Mode')
    {

        color_change.textContent = 'Light Mode' ;
        color_change.style.color = "#29231cee"
        color_change.style.backgroundColor = '#f0f2f5'
        ele.style.backgroundColor = "#251f1977";
         top.style.backgroundColor = '#ffffff' ;
    }
    else{
        color_change.textContent = 'Dark Mode' ;
         color_change.style.color = "#f0f2f5"
         color_change.style.backgroundColor = '#251f1977'
         ele.style.backgroundColor = "#f0f2f5" ;
         top.style.backgroundColor = '#ffffff' ;
    }

    
    console.log('dark');
})
// initial render

render_task() ;