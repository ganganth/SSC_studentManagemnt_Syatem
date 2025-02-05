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
public class Nametitle{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String name;


    @JsonIgnore
    @OneToMany(mappedBy = "nametitle")
    private List<Employee> nametitleEmployeeList;

    @JsonIgnore
    @OneToMany(mappedBy = "nametitle")
    private List<Guardian> nametitleGuardianList;

    @JsonIgnore
    @OneToMany(mappedBy = "nametitle")
    private List<Student> nametitleStudentList;


    public Nametitle(Integer id){
        this.id = id;
    }

}