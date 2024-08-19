package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Studentpayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface StudentpaymentDao extends JpaRepository<Studentpayment, Integer>{
    @Query("select new Studentpayment (s.id,s.code,s.student,s.enrollment) from Studentpayment s")
    Page<Studentpayment> findAllBasic(PageRequest pageRequest);

    Studentpayment findByCode(String code);
}