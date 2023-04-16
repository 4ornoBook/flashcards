package com.flashcardsapi.controllers;

import lombok.AllArgsConstructor;

import javax.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.flashcardsapi.entities.FlashcardsSet;
import com.flashcardsapi.entities.User;
import com.flashcardsapi.services.FlashcardsSetService;
import com.flashcardsapi.services.UserService;

@RestController
@RequestMapping("sets")
@AllArgsConstructor
public class FlashcardsSetController {
    private FlashcardsSetService flashcardsSetService;

    private UserService userService;

    @GetMapping("/{setId}")
    public FlashcardsSet getSetById(@PathVariable long setId) {
        return flashcardsSetService.getSetById(setId);
    }

    @PostMapping()
    public FlashcardsSet addNewSet(@Valid @RequestBody FlashcardsSet newSet, @AuthenticationPrincipal Jwt principal) {
        long userId = (long) principal.getClaims().get("id");
        User testUser = userService.getById(userId);
        return flashcardsSetService.addNewSet(newSet, testUser);
    }

    @PutMapping()
    public FlashcardsSet updateSet(@RequestBody FlashcardsSet setToUpdate) {
        try {
            return flashcardsSetService.updateSet(setToUpdate);
        } catch (IllegalArgumentException e) {
            // todo: remove try/catch block with exception handler
            return null;
        }
    }

    @DeleteMapping("/{setId}")
    public String deleteSetById(@PathVariable long setId) {
        flashcardsSetService.deleteSetById(setId);
        // todo: check if the user can delete this tag
        return "tag was successfully deleted";
    }
}
