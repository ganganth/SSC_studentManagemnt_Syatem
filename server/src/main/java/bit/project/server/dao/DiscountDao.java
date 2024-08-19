package bit.project.server.dao;

import bit.project.server.entity.Discount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface DiscountDao extends JpaRepository<Discount, Integer>{
    @Query("select new Discount (d.id,d.code,d.name,d.discounttype,d.discountstatus) from Discount d")
    Page<Discount> findAllBasic(PageRequest pageRequest);

    Discount findByCode(String code);
}