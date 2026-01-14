import React from "react";
import { SectionContainer } from "@/components/containers/SectionContainer";
import { TimelineItem } from "@/components/TimelineItem";

export function EducationContainer() {
  return (
    <SectionContainer id="education">
      <div className="max-w-15xl mx-auto px-4">
        <h2 className="section-title">Education</h2>

        <div className="mt-8 space-y-2 reveal opacity-0 px-2">
          <TimelineItem
            date="2021 - 2025"
            title="Jomo Kenyatta University of Agriculture and Technology (JKUAT)"
            description={
              <>
                <p className="mb-2">Bachelor of Science in Information Technology (IT)</p>
              </>
            }
          />

          <TimelineItem
            date="2017 - 2020"
            title="Kenya Certificate of Secondary Education (KCSE)"
            description={
              <>
                <p className="mb-2">Mean Grade: A- (minus) - 78 points</p>
              </>
            }
          />

          <TimelineItem
            date="2008 - 2015"
            title="Kenya Certificate of Primary Education (KCPE)"
            description={
              <>
                <p className="mb-2">Mean Grade: 352 out of 500</p>
              </>
            }
          />
        </div>
      </div>
    </SectionContainer>
  );
}

export default EducationContainer;
