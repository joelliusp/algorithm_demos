

function QSort(context){
	
	var leftcolor = "#f41ccd";
	var rightcolor = "#fce94f";
	var itercolor = "#729fcf";
	var lastcolor = "#ad7fa8";
	var formatStr = JSON.stringify;
	
	function genericForCondition(qSortFrame)
	{
		context.nextLine(7);
		context.outputToDivConsole(context.formatCondtionStr({type:"for loop",test: "<=",index1: qSortFrame.scope.i,
			index2: qSortFrame.scope.right,compare: function(a,b){return a <= b}}));
		if(qSortFrame.scope.i <= qSortFrame.scope.right){
			qSortFrame.nextFunction = sorter.iflessThanLeftCondition;
		}
		else{
			qSortFrame.nextFunction = sorter.swapLeftAndLast;
		}
		context.updateCounter(1);
	}
	
	function genericReturn(qSortFrame)
	{
		context.outputToDivConsole("Returning to calling function - stack pointer:" + (qSortFrame.callStack.length -1));
		qSortFrame.nextFunction = qSortFrame.scope.returnAddressFunction;
		qSortFrame.popStack();
		context.markStackFrameForDeletion(qSortFrame.callStack.length);
		context.updateCounter(1);
	}
	
	function getDrawObject(position,color,name){
		return {position:position,color:color,name: name};
	}
	
	
	var sorter = {};
	sorter.sourceCode = [["qsort(v[],int left, int right)","0"],
					["{","0;"],
					["int i;","5em;"],
					["int last;","5em;"],
					["if(left >= right)","5em;"],
					["return;","10em;"],
					["swap(v,left, (left + right)/2);","5em;"],
					["last = left;","5em;"],
					["for(i = left + 1;i<= right;i++){","5em;"],
					["if(v[i] < v[left]){","10em;"],
					["swap(v,++last,i)","15em;"],
					["}","10em;"],
					["}","5em;"],
					["swap(v,left,last);","5em;"],
					["qsort(v,left, last -1);","5em;"],
					["qsort(v,last+1,right);","5em;"],
					["}","0;"]];
					
	sorter.LoadCode = function(toBeSorted)
	{
		qSortScope = {v:toBeSorted,returnAddressFunction: sorter.terminalCall,left: 0, right: toBeSorted.length -1}
		var myFrame = new Frame(qSortScope);
	
		myFrame.nextFunction = sorter.callQsort;
	
		return myFrame;
	};
	
	sorter.callQsort = function(qSortFrame)
	{
	
			context.nextLine(0);
			var Lscope = qSortFrame.scope;
			context.outputToDivConsole("Calling qSort",1);
			context.outputToDivConsole(formatStr(Lscope),1);
			context.outputCurrentSortOrder(Lscope.v);
			context.outputToStackTable("qSort(array,"+Lscope.left+","+Lscope.right+")",qSortFrame.callStack.length-1);
			qSortFrame.nextFunction = sorter.checkIfLeftgtRight;
			context.updateCounter(1);
			context.drawPointers(
				 sorter.getLeftDrawObject(Lscope.left)
				,sorter.getRightDrawObject(Lscope.right));
	};
	
	sorter.checkIfLeftgtRight = function(qSortFrame)
	{
			context.nextLine(4);
			var Lscope = qSortFrame.scope;
			var outputStr = context.formatCondtionStr({type: "if",test: ">=",index1:Lscope.left,index2: Lscope.right,
				compare: function(a,b){ return a >= b}});
			context.outputToDivConsole(outputStr,5);
			if(Lscope.left >= Lscope.right){
				qSortFrame.nextFunction = sorter.insideIfReturn;
			}
			else{
				qSortFrame.nextFunction = sorter.swapLeftandMid;
			}
			context.updateCounter(1);
	};
	sorter.insideIfReturn = function(qSortFrame)
	{
			context.nextLine(4);
			genericReturn(qSortFrame);
		
	};
	sorter.swapLeftandMid = function(qSortFrame)
	{
		var Lscope = qSortFrame.scope;
		var mid = Math.floor((Lscope.left + Lscope.right)/2);
	
		context.nextLine(6);
		qSortFrame.nextFunction = sorter.assignLast;
		context.callSwaps(Lscope.v,Lscope.left,mid);
		context.outputToDivConsole(formatStr(Lscope),7);
		context.drawPointers(
			 sorter.getLeftDrawObject(Lscope.left)
			,sorter.getRightDrawObject(Lscope.right)
			,{position: mid,color:"#4e9a06",name:"mid"});
	};
	sorter.assignLast = function(qSortFrame)
	{
		context.nextLine(6);
		qSortFrame.scope.last = qSortFrame.scope.left;
		context.outputToDivConsole(formatStr(qSortFrame.scope),8);
		qSortFrame.nextFunction =sorter.initialForStatement;
		context.updateCounter(1);
		context.drawPointers(
			 sorter.getLeftDrawObject(qSortFrame.scope.left)
			,sorter.getRightDrawObject(qSortFrame.scope.right)
			,sorter.getLastDrawObject(qSortFrame.scope.last));
	};
	sorter.initialForStatement = function(qSortFrame)
	{
		//var qS = new QSort();
		qSortFrame.scope.i = qSortFrame.scope.left + 1;
		genericForCondition(qSortFrame);
		context.drawPointers(
			 sorter.getLeftDrawObject(qSortFrame.scope.left)
			,sorter.getRightDrawObject(qSortFrame.scope.right)
			,sorter.getLastDrawObject(qSortFrame.scope.last)
			,sorter.getIteratorDrawObject(qSortFrame.scope.i));
	
	};
	sorter.iflessThanLeftCondition = function(qSortFrame)
	{
		context.nextLine(7);
		var Lscope = qSortFrame.scope;
		context.outputToDivConsole(context.formatCondtionStr({type:"if",test:"<",v:Lscope.v,index1: Lscope.i,index2:Lscope.left,
			compare: function(a,b){return a < b}}));
	
		if(Lscope.v[Lscope.i] < Lscope.v[Lscope.left]){
			qSortFrame.nextFunction = sorter.conditionalSwap;
		}
		else{
			qSortFrame.nextFunction = sorter.endSwapIfBlock;
		}
		context.updateCounter(1);
	};
	sorter.conditionalSwap = function(qSortFrame)
	{
		var Lscope = qSortFrame.scope;
		context.nextLine(9);
		++Lscope.last;
		context.outputToDivConsole(formatStr(Lscope));
		context.drawPointers(
			 sorter.getLeftDrawObject(Lscope.left)
			,sorter.getRightDrawObject(Lscope.right)
			,sorter.getLastDrawObject(Lscope.last)
			,sorter.getIteratorDrawObject(Lscope.i));
		context.callSwaps(Lscope.v,Lscope.last,Lscope.i);
		qSortFrame.nextFunction = sorter.endSwapIfBlock;
	};
	sorter.endSwapIfBlock = function(qSortFrame)
	{
		context.nextLine(10);
		qSortFrame.nextFunction = sorter.repeatForStatement;
	};
	sorter.repeatForStatement = function(qSortFrame)
	{
		context.nextLine(11);
		qSortFrame.scope.i++;
		context.drawPointers(
			 sorter.getLeftDrawObject(qSortFrame.scope.left)
			,sorter.getRightDrawObject(qSortFrame.scope.right)
			,sorter.getLastDrawObject(qSortFrame.scope.last)
			,sorter.getIteratorDrawObject(qSortFrame.scope.i));
		genericForCondition(qSortFrame);
		context.updateCounter(1);
	};
	sorter.endForBlock =function(qSortFrame)
	{
		context.nextLine(11);
		qSortFrame.nextFunction = sorter.swapLeftAndLast;
	};
	sorter.swapLeftAndLast = function(qSortFrame)
	{
		var Lscope = qSortFrame.scope;
		context.nextLine(12);
		context.drawPointers(
			 sorter.getLeftDrawObject(qSortFrame.scope.left)
			,sorter.getRightDrawObject(qSortFrame.scope.right)	
			,sorter.getLastDrawObject(qSortFrame.scope.last)
			,sorter.getIteratorDrawObject(qSortFrame.scope.i));
		context.outputToDivConsole(formatStr(Lscope));
		context.callSwaps(Lscope.v,Lscope.left,Lscope.last);
		qSortFrame.nextFunction = sorter.recursiveCallQSort;
	};
	sorter.recursiveCallQSort = function(qSortFrame)
	{	
	
		var oldV = qSortFrame.scope.v;
		var oldLast = qSortFrame.scope.last;
		var oldLeft = qSortFrame.scope.left;
		context.nextLine(13);
		qSortFrame.callStack.push(qSortFrame.scope);
		qSortFrame.scope = {v:oldV,returnAddressFunction: sorter.returnAddressRecursiveCallQSort,left: oldLeft,right:oldLast-1};
		context.outputToDivConsole("Calling qSort recursively");
		qSortFrame.nextFunction = sorter.callQsort;
	
	};
	sorter.returnAddressRecursiveCallQSort = function(qSortFrame)
	{
		context.nextLine(13);
		qSortFrame.nextFunction = sorter.recursiveCallQSortAgain;
	};
	sorter.recursiveCallQSortAgain = function(qSortFrame)
	{
		var oldV = qSortFrame.scope.v;
		var oldLast = qSortFrame.scope.last;
		var oldRight = qSortFrame.scope.right;
		context.nextLine(14);
		qSortFrame.callStack.push(qSortFrame.scope);
		qSortFrame.scope = {v:oldV,returnAddressFunction: sorter.returnAddressAgain,left: oldLast+1,right:oldRight};
		context.outputToDivConsole("Calling qSort recursively");
		qSortFrame.nextFunction = sorter.callQsort;
	
	};
	sorter.returnAddressAgain = function(qSortFrame)
	{
		context.nextLine(15);
		genericReturn(qSortFrame)
	};
	sorter.terminalCall = function(qSortFrame)
	{
		qSortFrame.scope = undefined;
		context.pageCleanUp();
	};
	
	sorter.getLeftDrawObject = function(position){
		return getDrawObject(position,leftcolor,"left");
	}
	
	sorter.getRightDrawObject = function(position){
		return getDrawObject(position,rightcolor,"right");
	}
	
	sorter.getLastDrawObject = function(position){
		return getDrawObject(position,lastcolor,"Last");
	}
	
	sorter.getIteratorDrawObject = function(position){
		return getDrawObject(position,itercolor,"Iterator");
	}
	
	
	
		
	return sorter;
}




