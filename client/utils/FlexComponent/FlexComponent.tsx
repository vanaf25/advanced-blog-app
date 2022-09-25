import React from 'react';
enum JustifyContentTypes{
    Start="start",
    Center="center",
    SpaceBetween="space-between",
    SpaceAround="space-around",
    SpaceEvenly="space-evenly"
}
type FlexComponentProps={
    justifyContent:JustifyContentTypes,
    alignItems:any
}
const FlexComponent:React.FC<FlexComponentProps> = () => {
    return (
        <div>

        </div>
    );
};

export default FlexComponent;
