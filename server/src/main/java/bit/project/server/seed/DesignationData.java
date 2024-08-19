package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class DesignationData extends AbstractSeedClass {

    public DesignationData(){
        addIdNameData(1, "Teacher");
        addIdNameData(2, "Principal");
        addIdNameData(3, "Deputy Principal");
    }

}
