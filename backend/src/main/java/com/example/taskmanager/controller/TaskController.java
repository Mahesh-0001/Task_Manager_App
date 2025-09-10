package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // allow frontend to connect
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // GET all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // GET single task
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST create task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        if (task.getCreatedAt() == null) {
            task.setCreatedAt(LocalDateTime.now());
        }
        if ("DONE".equals(task.getStatus())) {
            task.setCompletedAt(LocalDateTime.now());
        }
        Task created = taskRepository.save(task);
        return ResponseEntity.ok(created);
    }

    // PUT update task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task updatedTask) {

        return taskRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedTask.getTitle());
                    existing.setDescription(updatedTask.getDescription());
                    existing.setStatus(updatedTask.getStatus());

                    if ("DONE".equals(updatedTask.getStatus())) {
                        existing.setCompletedAt(LocalDateTime.now());
                    } else {
                        existing.setCompletedAt(null);
                    }

                    Task saved = taskRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE task (only if status == DONE)
    @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
    return taskRepository.findById(id)
            .map(task -> {
                if ("DONE".equals(task.getStatus())) {
                    taskRepository.delete(task);
                    return ResponseEntity.noContent().<Void>build(); // 204
                } else {
                    return ResponseEntity.badRequest().<Void>build(); // 400 if not DONE
                }
            })
            .orElseGet(() -> ResponseEntity.notFound().build()); // 404
}

}
