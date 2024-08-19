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
public class Discount{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private BigDecimal fixedamount;

    private BigDecimal percentage;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Discounttype discounttype;

    @ManyToOne
    private Discountstatus discountstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @ManyToMany(mappedBy = "discountList")
    private List<Enrollment> enrollmentList;


    public Discount(Integer id){
        this.id = id;
    }

    public Discount(Integer id, String code, String name, Discounttype discounttype, Discountstatus discountstatus){
        this.id = id;
        this.code = code;
        this.name = name;
        this.discounttype = discounttype;
        this.discountstatus = discountstatus;
    }

}