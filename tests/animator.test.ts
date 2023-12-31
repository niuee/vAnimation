import { Point } from "point2point";
import { AnimationSequence, Keyframe, PointAnimationHelper, AnimationGroup, AnimationGroupLegacy, AnimationSequenceLegacy} from "../src";
import * as EasingFunctions from "../src/easeFunctions";

class AnimationMockClass {
    private position: Point;

    constructor(position: Point){
        this.position = position;
    }

    setPosition(destinationPos: Point){
        this.position = destinationPos;
    }

    getPosition(): Point{
        return this.position
    }
}

describe("Animator Tests", ()=>{

    let testAnimator: AnimationGroupLegacy;
    let exampleObj: AnimationMockClass;

    beforeEach(()=>{

        const positionKeyframes: Keyframe<Point>[] = [];

        positionKeyframes.push({percentage: 0, value: {x: 0, y: 0}});
        positionKeyframes.push({percentage: 0.5, value: {x: 3, y: 3}});
        positionKeyframes.push({percentage: 1, value: {x: 10, y: 10}});

        exampleObj = new AnimationMockClass({x: 0, y: 0});
        const positionAnimationSequence: AnimationSequenceLegacy<Point> = {
            keyframes: positionKeyframes,
            applyAnimationValue: exampleObj.setPosition.bind(exampleObj),
            animatableAttributeHelper: new PointAnimationHelper(),
        };
        testAnimator = new AnimationGroupLegacy([positionAnimationSequence]);
    });

    test("Play Animation", ()=>{
        const duration = 2;
        testAnimator.setDuration(duration);
        testAnimator.startAnimation();
        const deltaTime = 0.1;
        let time = 0;
        while (time <= duration){
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
        expect(exampleObj.getPosition()).toEqual({x: 10, y: 10});
    });

    test("Without starting an animation the animated attribute won't change", ()=>{
        const deltaTime = 0.1;
        let time = 0;
        while (time <= 1){
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
        expect(exampleObj.getPosition()).toEqual({x: 0, y: 0});
    });

    test("Canceling the animation would stop the animation", ()=>{
        const deltaTime = 0.1;
        let time = 0;
        testAnimator.startAnimation();
        let expectedPosition: Point = {x: 0, y: 0};
        while (time <= 1){
            if(time == 0.4){
                testAnimator.cancelAnimation();
                expectedPosition = exampleObj.getPosition();
            }
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
        expect(exampleObj.getPosition()).toEqual(expectedPosition);
    });

    test("Animation is played according to keyframes", ()=>{
        const deltaTime = 0.1;
        let time = 0;
        testAnimator.startAnimation();
        while (time <= 1){
            if(time == 0.5){
                expect(exampleObj.getPosition().x).toBeCloseTo(3);
                expect(exampleObj.getPosition().y).toBeCloseTo(3);
            }
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
    });

    test("Animation that will use the extrapolation in helper", ()=>{
        const deltaTime = 0.01;
        let time = 0;
        testAnimator.startAnimation();
        while (time <= 1){
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
    });

});

describe("AnimationGroupB Tests", ()=>{

    let testAnimator: AnimationGroup;
    let exampleObj: AnimationMockClass;

    beforeEach(()=>{

        const positionKeyframes: Keyframe<Point>[] = [];

        positionKeyframes.push({percentage: 0, value: {x: 0, y: 0}});
        positionKeyframes.push({percentage: 0.5, value: {x: 3, y: 3}});
        positionKeyframes.push({percentage: 1, value: {x: 10, y: 10}});

        exampleObj = new AnimationMockClass({x: 0, y: 0});
        const positionAnimationSequence: AnimationSequence<Point> = {
            duration: 1,
            keyframes: positionKeyframes,
            applyAnimationValue: (value: Point) => {exampleObj.setPosition(value);},
            animatableAttributeHelper: new PointAnimationHelper(),
        };
        testAnimator = new AnimationGroup(0, [positionAnimationSequence], 1, false);
    });

    test("Play Animation", ()=>{
        const duration = 2;
        testAnimator.setDuration(duration);
        testAnimator.startAnimation();
        const deltaTime = 0.1;
        let time = 0;
        while (time <= duration){
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
        expect(exampleObj.getPosition()).toEqual({x: 10, y: 10});
    });

    test("Without starting an animation the animated attribute won't change", ()=>{
        const deltaTime = 0.1;
        let time = 0;
        while (time <= 1){
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
        expect(exampleObj.getPosition()).toEqual({x: 0, y: 0});
    });

    test("Canceling the animation would stop the animation", ()=>{
        const deltaTime = 0.1;
        let time = 0;
        testAnimator.startAnimation();
        let expectedPosition: Point = {x: 0, y: 0};
        while (time <= 1){
            if(time == 0.4){
                testAnimator.cancelAnimation();
                expectedPosition = exampleObj.getPosition();
            }
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
        expect(exampleObj.getPosition()).toEqual(expectedPosition);
    });

    test("Animation is played according to keyframes", ()=>{
        const deltaTime = 0.1;
        let time = 0;
        testAnimator.startAnimation();
        while (time <= 1){
            if(time == 0.5){
                expect(exampleObj.getPosition().x).toBeCloseTo(3);
                expect(exampleObj.getPosition().y).toBeCloseTo(3);
            }
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
    });

    test("Animation that will use the extrapolation in helper", ()=>{
        const deltaTime = 0.01;
        let time = 0;
        testAnimator.startAnimation();
        while (time <= 1){
            testAnimator.animate(deltaTime);
            time += deltaTime;
        }
    });

});