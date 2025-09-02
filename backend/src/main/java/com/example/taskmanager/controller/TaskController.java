package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // allow frontend to connect later
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // GET all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.getAllTasks();
    }

    // GET single task
    @GetMapping("/{id}")
    public Optional<Task> getTask(@PathVariable Long id) {
        return taskRepository.getTaskById(id);
    }

    // // POST create task
    // @PostMapping
    // public Task createTask(@RequestBody Task task) {
    //     return taskRepository.addTask(task);
    // }

    // // PUT update task
    // @PutMapping("/{id}")
    // public Optional<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
    //     return taskRepository.updateTask(id, updatedTask);
    // }

    @PostMapping
public Task createTask(@RequestBody @jakarta.validation.Valid Task task) {
    return taskRepository.addTask(task);
}

    @PutMapping("/{id}")
    public Optional<Task> updateTask(@PathVariable Long id,
                                 @RequestBody @jakarta.validation.Valid Task updatedTask) {
    return taskRepository.updateTask(id, updatedTask);
}


    // DELETE task
    @DeleteMapping("/{id}")
    public boolean deleteTask(@PathVariable Long id) {
        return taskRepository.deleteTask(id);
    }
}
