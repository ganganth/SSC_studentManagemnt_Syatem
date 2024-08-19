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
public class Cls{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String year;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Gradeyear gradeyear;

    @ManyToOne
    private Medium medium;

    @ManyToOne
    private Employee teacher;

    @ManyToOne
    private Employee assistantteacher;

    @ManyToOne
    private Student monitor;

    @ManyToOne
    private Student vicemonitor;

    @OneToMany(mappedBy="cls", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Clssubject> clssubjectList;

    @ManyToOne
    private Clsstatus clsstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "cls")
    private List<Clssession> clsClssessionList;

    @JsonIgnore
    @OneToMany(mappedBy = "cls")
    private List<Materialissue> clsMaterialissueList;

    @JsonIgnore
    @OneToMany(mappedBy = "cls")
    private List<Studentattendance> clsStudentattendanceList;

    @JsonIgnore
    @OneToMany(mappedBy = "cls")
    private List<Timetable> clsTimetableList;


    @ManyToMany
        @JoinTable(
        name="clsstudent",
        joinColumns=@JoinColumn(name="cls_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="student_id", referencedColumnName="id")
    )
    private List<Student> studentList;


    public Cls(Integer id){
        this.id = id;
    }

    public Cls(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}
