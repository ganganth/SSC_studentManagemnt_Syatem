package bit.project.server.entity;

import lombok.Data;
import javax.persistence.Id;
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
public class Report {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private Integer grade;

    private Integer total_student;

    private Integer present_student;

    private Integer absent_student;

    private Integer credit_A;

    private Integer credit_B;

    private Integer credit_C;

    private Integer credit_D;

    private Integer credit_F;

    public Report(Integer id,Integer grade, Integer total_student, Integer credit_A){
        this.id = id;
        this.grade = grade;
        this.total_student = total_student;
        this.credit_A = credit_A;
    }

    public Report(Integer id,Integer grade, Integer credit_A, Integer credit_B, Integer credit_C, Integer credit_D, Integer credit_F ){
        this.id = id;
        this.grade = grade;
        this.credit_A = credit_A;
        this.credit_B = credit_B;
        this.credit_C = credit_C;
        this.credit_D = credit_D;
        this.credit_F = credit_F;
    }

    public Report(Integer grade, Integer absent_student, Integer present_student) {
        this.grade = grade;
        this.absent_student = absent_student;
        this.present_student = present_student;
    }
    public Report(Integer grade,Integer credit_A ) {
        this.grade = grade;
        this.credit_A = credit_A;
    }

}
