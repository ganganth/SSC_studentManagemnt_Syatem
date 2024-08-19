package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Examresult{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private Boolean isprersent;

    private BigDecimal marks;

    private String grade;

    @Lob
    private String feedback;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Exam exam;

    @ManyToOne
    private Student student;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Examresult(Integer id){
        this.id = id;
    }

    public Examresult(Integer id, String code, Exam exam, Student student){
        this.id = id;
        this.code = code;
        this.exam = exam;
        this.student = student;
    }

}