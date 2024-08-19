package bit.project.server.dao;

import bit.project.server.entity.Payscheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PayschemeDao extends JpaRepository<Payscheme, Integer>{
}