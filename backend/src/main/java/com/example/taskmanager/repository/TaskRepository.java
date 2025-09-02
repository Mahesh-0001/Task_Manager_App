package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class TaskRepository {
    private final Map<Long, Task> taskStore = new HashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    // CREATE
    public Task addTask(Task task) {
        long id = counter.getAndIncrement();
        task.setId(id);
        taskStore.put(id, task);
        return task;
    }

    // READ
    public List<Task> getAllTasks() {
        return new ArrayList<>(taskStore.values());
    }

    public Optional<Task> getTaskById(Long id) {
        return Optional.ofNullable(taskStore.get(id));
    }

    // UPDATE
    public Optional<Task> updateTask(Long id, Task updated) {
        if (taskStore.containsKey(id)) {
            updated.setId(id);
            taskStore.put(id, updated);
            return Optional.of(updated);
        }
        return Optional.empty();
    }

    // DELETE
    public boolean deleteTask(Long id) {
        return taskStore.remove(id) != null;
    }
}
