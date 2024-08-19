package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
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
public class Enrollment{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private BigDecimal discountamount;

    private BigDecimal fee;

    private BigDecimal balance;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Student student;

    @ManyToOne
    private Payscheme payscheme;

    @ManyToOne
    private Gradeyear gradeyear;

    @ManyToOne
    private Enrollmentstatus enrollmentstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "enrollment")
    private List<Studentpayment> enrollmentStudentpaymentList;


    @ManyToMany
        @JoinTable(
        name="enrollmentdiscount",
        joinColumns=@JoinColumn(name="enrollment_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="discount_id", referencedColumnName="id")
    )
    private List<Discount> discountList;


    public Enrollment(Integer id){
        this.id = id;
    }

    public Enrollment(Integer id, String code, Student student){
        this.id = id;
        this.code = code;
        this.student = student;
    }

}