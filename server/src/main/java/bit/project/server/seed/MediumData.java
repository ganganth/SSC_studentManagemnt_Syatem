package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class MediumData extends AbstractSeedClass {

    public MediumData(){
        addIdNameData(1, "English");
        addIdNameData(2, "Sinhala");
    }

}