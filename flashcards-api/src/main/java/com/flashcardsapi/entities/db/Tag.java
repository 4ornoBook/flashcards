package com.flashcardsapi.entities.db;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Setter
@Getter
@NoArgsConstructor
@ToString
@AllArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(length = 50, nullable = false)
    private String name;

    private boolean isPublic;


    @ManyToMany(mappedBy = "tags", cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = "tags")
    private List<FlashcardsSet> sets = new ArrayList<>();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id", referencedColumnName = "id", nullable = false)
    private Color color;

    public Tag(User user, String name, Color color) {
        this.user = user;
        this.name = name;
        this.color = color;
    }

    @JsonGetter(value = "userId")
    public Long getUserId() {
        return user.getId();
    }
}
