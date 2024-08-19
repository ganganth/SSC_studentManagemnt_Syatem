package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class GuardianrelationshipData extends AbstractSeedClass {

    public GuardianrelationshipData(){
        addIdNameData(1, "Father");
        addIdNameData(2, "Mother");
        addIdNameData(3, "Legal Guardian");
    }

}