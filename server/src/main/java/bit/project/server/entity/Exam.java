package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
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
public class Exam{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private LocalTime tostart;

    private LocalTime toend;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Gradeyear gradeyear;

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private Examstatus examstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "exam")
    private List<Examresult> examExamresultList;


    public Exam(Integer id){
        this.id = id;
    }

    public Exam(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}