package com.flashcardsapi.repositories;

import org.springframework.data.repository.CrudRepository;

import com.flashcardsapi.entities.db.Color;

public interface TagColorRepository extends CrudRepository<Color, Long> {
}
