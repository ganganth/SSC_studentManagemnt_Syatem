package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Gradeyear{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String year;

    private LocalDate dostart;

    private LocalDate doend;

    private BigDecimal totalfee;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Grade grade;

    @ManyToOne
    private Gradeyearstatus gradeyearstatus;

    @OneToMany(mappedBy="gradeyear", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Yearterm> yeartermList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "gradeyear")
    private List<Cls> gradeyearClsList;

    @JsonIgnore
    @OneToMany(mappedBy = "gradeyear")
    private List<Enrollment> gradeyearEnrollmentList;

    @JsonIgnore
    @OneToMany(mappedBy = "gradeyear")
    private List<Exam> gradeyearExamList;

    @JsonIgnore
    @OneToMany(mappedBy = "gradeyear")
    private List<Materialissue> gradeyearMaterialissueList;

    @JsonIgnore
    @OneToMany(mappedBy = "gradeyear")
    private List<Timetable> gradeyearTimetableList;


    public Gradeyear(Integer id){
        this.id = id;
    }

    public Gradeyear(Integer id, String code, Grade grade, Gradeyearstatus gradeyearstatus){
        this.id = id;
        this.code = code;
        this.grade = grade;
        this.gradeyearstatus = gradeyearstatus;
    }

}