


import ychart from "./Ycharts"
import Bezier from "./shape/Bezier"
import Circle from "./shape/Circle"
import Line from "./shape/Line"
import Rect from "./shape/Rect"
import Triangle from "./shape/Triangle"
import YText from "./shape/YText"
import Group from "./Group"
import Animation from "./animation/animation"


ychart.shape = {Bezier ,Circle ,Line ,Rect ,Triangle ,YText};

ychart.Group = Group;

ychart.version =1.0;

ychart.Animation = Animation;

export default ychart