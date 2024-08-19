package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Grade{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String name;


    @JsonIgnore
    @OneToMany(mappedBy = "grade")
    private List<Clssession> gradeClssessionList;

    @JsonIgnore
    @OneToMany(mappedBy = "grade")
    private List<Gradeyear> gradeGradeyearList;

    @JsonIgnore
    @OneToMany(mappedBy = "grade")
    private List<Lesson> gradeLessonList;

    @JsonIgnore
    @OneToMany(mappedBy = "grade")
    private List<Subject> gradeSubjectList;

    @JsonIgnore
    @OneToMany(mappedBy = "grade")
    private List<Timetable> gradeTimetableList;


    public Grade(Integer id){
        this.id = id;
    }

}