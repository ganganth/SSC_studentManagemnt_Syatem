package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class BloodtypeData extends AbstractSeedClass {

    public BloodtypeData(){
        addIdNameData(1, "A+");
        addIdNameData(2, "A-");
        addIdNameData(3, "B+");
        addIdNameData(4, "B-");
        addIdNameData(5, "C+");
        addIdNameData(6, "C-");
        addIdNameData(7, "O+");
        addIdNameData(8, "O-");
    }

}