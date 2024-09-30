document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterCategory = document.getElementById('filter-category');
    const filterPriority = document.getElementById('filter-priority');
    const filterCompletion = document.getElementById('filter-completion');
    
    const performanceChartCtx = document.getElementById('performanceChart').getContext('2d');
    let tasks = [];
    
    // Initialize Chart
    const performanceChart = new Chart(performanceChartCtx, {
      type: 'bar',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          label: '# of Tasks',
          data: [0, 0],
          backgroundColor: ['#5cb85c', '#f0ad4e'],
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Task constructor
    function Task(name, category, deadline, priority = 'Medium', completed = false) {
      this.name = name;
      this.category = category;
      this.deadline = deadline;
      this.priority = priority;
      this.completed = completed;
    }
  
    // Add task to list
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskName = document.getElementById('task-name').value;
      const taskCategory = document.getElementById('category').value;
      const taskDeadline = document.getElementById('deadline').value;
      const taskPriority = prompt('Set priority (High, Medium, Low):', 'Medium');
  
      if (taskName.trim() && taskPriority) {
        const newTask = new Task(taskName, taskCategory, taskDeadline, taskPriority);
        tasks.push(newTask);
        displayTasks();
        updateChart();
        taskForm.reset();
      }
    });
  
    // Display tasks
    function displayTasks() {
      taskList.innerHTML = '';
  
      const filteredTasks = tasks.filter((task) => {
        return (
          (filterCategory.value === 'All' || task.category === filterCategory.value) &&
          (filterPriority.value === 'All' || task.priority === filterPriority.value) &&
          (filterCompletion.value === 'All' ||
           (filterCompletion.value === 'Completed' && task.completed) ||
           (filterCompletion.value === 'Pending' && !task.completed))
        );
      });
  
      filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="task-details ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="complete-task" data-index="${index}" ${task.completed ? 'checked' : ''}>
            <strong>${task.name}</strong> - ${task.category} 
            <br>Priority: ${task.priority}
            <br>Deadline: ${task.deadline ? task.deadline : 'No deadline'}
          </div>
          <div class="task-buttons">
            <button class="edit" data-index="${index}">Edit</button>
            <button class="delete" data-index="${index}">Delete</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }
  
    // Toggle completion of a task
    taskList.addEventListener('change', (e) => {
      if (e.target.classList.contains('complete-task')) {
        const index = e.target.getAttribute('data-index');
        tasks[index].completed = e.target.checked;
        displayTasks();
        updateChart();
      }
    });
  
    // Edit task
    taskList.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit')) {
        const index = e.target.getAttribute('data-index');
        const task = tasks[index];
        const newName = prompt('Edit task name:', task.name);
        const newCategory = prompt('Edit task category (Work, Personal, Urgent):', task.category);
        const newDeadline = prompt('Edit deadline:', task.deadline);
        const newPriority = prompt('Edit priority (High, Medium, Low):', task.priority);
        
        if (newName) {
          tasks[index] = new Task(newName, newCategory, newDeadline, newPriority, task.completed);
          displayTasks();
          updateChart();
        }
      }
    });
  
    // Delete task
    taskList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        const index = e.target.getAttribute('data-index');
        tasks.splice(index, 1);
        displayTasks();
        updateChart();
      }
    });
  
    // Filter tasks
    filterCategory.addEventListener('change', displayTasks);
    filterPriority.addEventListener('change', displayTasks);
    filterCompletion.addEventListener('change', displayTasks);
  
    // Update performance chart
    function updateChart() {
      const completedTasks = tasks.filter(task => task.completed).length;
      const pendingTasks = tasks.filter(task => !task.completed).length;
  
      performanceChart.data.datasets[0].data = [completedTasks, pendingTasks];
      performanceChart.update();
    }
  });
  