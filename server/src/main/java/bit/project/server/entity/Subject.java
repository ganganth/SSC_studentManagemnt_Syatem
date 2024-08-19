package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
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
public class Subject{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Grade grade;

    @ManyToOne
    private Medium medium;

    @ManyToOne
    private Subjectstatus subjectstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "subject")
    private List<Clssubject> clssubjectsubjectList;

    @JsonIgnore
    @OneToMany(mappedBy = "subject")
    private List<Exam> subjectExamList;

    @JsonIgnore
    @OneToMany(mappedBy = "subject")
    private List<Lesson> subjectLessonList;

    @JsonIgnore
    @OneToMany(mappedBy = "subject")
    private List<Material> subjectMaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "subject")
    private List<Timetable> subjectTimetableList;


    @ManyToMany
        @JoinTable(
        name="subjectemployee",
        joinColumns=@JoinColumn(name="subject_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="employee_id", referencedColumnName="id")
    )
    private List<Employee> employeeList;


    public Subject(Integer id){
        this.id = id;
    }

    public Subject(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}
