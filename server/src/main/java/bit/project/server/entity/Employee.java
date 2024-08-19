package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
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
public class Employee{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String callingname;

    private String fullname;

    private String photo;

    private LocalDate dobirth;

    private String nic;

    private String mobile;

    private String land;

    private String email;

    @Lob
    private String address;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Nametitle nametitle;

    @ManyToOne
    private Civilstatus civilstatus;

    @ManyToOne
    private Gender gender;

    @ManyToOne
    private Designation designation;

    @ManyToOne
    private Employeestatus employeestatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "teacher")
    private List<Cls> teacherClsList;

    @JsonIgnore
    @OneToMany(mappedBy = "assistantteacher")
    private List<Cls> assistantteacherClsList;

    @JsonIgnore
    @OneToMany(mappedBy = "teacher")
    private List<Clssubject> clssubjectteacherList;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Material> employeeMaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "teacher")
    private List<Timetable> teacherTimetableList;


    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Subject> subjectList;


    public Employee(Integer id){
        this.id = id;
    }

    public Employee(Integer id, String code, Nametitle nametitle, String callingname, String photo){
        this.id = id;
        this.code = code;
        this.nametitle = nametitle;
        this.callingname = callingname;
        this.photo = photo;
    }

}