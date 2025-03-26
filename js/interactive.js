// 主要交互式功能脚本
document.addEventListener('DOMContentLoaded', function() {
    // 返回顶部按钮功能
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 图片延迟加载
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // 模块测验功能
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const questionEl = this.closest('.quiz-question');
            const isSingleChoice = questionEl.querySelectorAll('.quiz-option[data-correct="true"]').length === 1;
            
            if (isSingleChoice) {
                questionEl.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }
            
            this.classList.toggle('selected');
        });
    });
    
    // 滑动丝模型动画控制
    initSlidingFilamentAnimation();
    
    // 肌纤维类型比较工具
    initFiberTypeComparison();
    
    // 力量-速度关系交互工具
    initForceVelocityTool();
    
    // 肌节结构交互式探索工具
    initSarcomereExplorer();
    
    // 发放频率与肌肉张力交互工具
    initFiringRateTool();
});

// 滑动丝模型动画
function initSlidingFilamentAnimation() {
    const slidingFilamentContainer = document.getElementById('slidingFilamentAnimation');
    if (!slidingFilamentContainer) return;
    
    // 创建动画控制界面
    const controls = document.createElement('div');
    controls.className = 'animation-controls';
    controls.innerHTML = `
        <button id="startAnimation" class="btn btn-primary">开始动画</button>
        <button id="pauseAnimation" class="btn btn-secondary">暂停</button>
        <button id="resetAnimation" class="btn btn-secondary">重置</button>
        <div class="slider-container">
            <label for="animationSpeed">速度: </label>
            <input type="range" id="animationSpeed" min="1" max="10" value="5">
        </div>
    `;
    slidingFilamentContainer.appendChild(controls);
    
    // 创建动画画布
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 300;
    canvas.className = 'animation-canvas';
    slidingFilamentContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let isPlaying = false;
    let speed = 5;
    let position = 0;
    
    // 绘制肌节初始状态
    drawSarcomere(ctx, position);
    
    // 添加事件监听器
    document.getElementById('startAnimation').addEventListener('click', function() {
        if (!isPlaying) {
            isPlaying = true;
            animate();
        }
    });
    
    document.getElementById('pauseAnimation').addEventListener('click', function() {
        isPlaying = false;
        cancelAnimationFrame(animationId);
    });
    
    document.getElementById('resetAnimation').addEventListener('click', function() {
        isPlaying = false;
        cancelAnimationFrame(animationId);
        position = 0;
        drawSarcomere(ctx, position);
    });
    
    document.getElementById('animationSpeed').addEventListener('input', function() {
        speed = parseInt(this.value);
    });
    
    // 动画循环
    function animate() {
        if (!isPlaying) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        position += 0.5 * (speed / 5);
        if (position > 50) {
            position = 50;
            isPlaying = false;
        }
        
        drawSarcomere(ctx, position);
        
        if (isPlaying) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    // 绘制肌节
    function drawSarcomere(ctx, pos) {
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;
        
        // 绘制Z线
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(100, centerY - 80);
        ctx.lineTo(100, centerY + 80);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(width - 100, centerY - 80);
        ctx.lineTo(width - 100, centerY + 80);
        ctx.stroke();
        
        // 绘制M线
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2, centerY - 70);
        ctx.lineTo(width / 2, centerY + 70);
        ctx.stroke();
        
        // 绘制粗肌丝（肌球蛋白）
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.rect(width / 2 - 100, centerY - 10, 200, 20);
        ctx.fill();
        
        // 绘制细肌丝（肌动蛋白）- 左侧
        ctx.fillStyle = '#f44336';
        ctx.beginPath();
        ctx.rect(100, centerY - 5, 150 - pos, 10);
        ctx.fill();
        
        // 绘制细肌丝（肌动蛋白）- 右侧
        ctx.beginPath();
        ctx.rect(width - 100 - (150 - pos), centerY - 5, 150 - pos, 10);
        ctx.fill();
        
        // 绘制横桥
        const bridgeCount = 10;
        const bridgeSpacing = 180 / bridgeCount;
        
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        
        // 左侧横桥
        for (let i = 0; i < bridgeCount; i++) {
            const x = width / 2 - 90 + i * bridgeSpacing;
            const y1 = centerY - 10;
            const y2 = centerY - 5;
            
            if (x < width / 2 - 100 + 150 - pos) {
                ctx.beginPath();
                ctx.moveTo(x, y1);
                
                // 根据位置调整横桥角度
                const angle = (pos / 50) * Math.PI / 3;
                const controlX = x - 5 * Math.sin(angle);
                const controlY = (y1 + y2) / 2 - 5 * Math.cos(angle);
                
                ctx.quadraticCurveTo(controlX, controlY, x - 10 * Math.sin(angle), y2);
                ctx.stroke();
            }
        }
        
        // 右侧横桥
        for (let i = 0; i < bridgeCount; i++) {
            const x = width / 2 + 90 - i * bridgeSpacing;
            const y1 = centerY + 10;
            const y2 = centerY + 5;
            
            if (x > width / 2 + 100 - 150 + pos) {
                ctx.beginPath();
                ctx.moveTo(x, y1);
                
                // 根据位置调整横桥角度
                const angle = (pos / 50) * Math.PI / 3;
                const controlX = x + 5 * Math.sin(angle);
                const controlY = (y1 + y2) / 2 + 5 * Math.cos(angle);
                
                ctx.quadraticCurveTo(controlX, controlY, x + 10 * Math.sin(angle), y2);
                ctx.stroke();
            }
        }
        
        // 添加标签
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        ctx.fillText('Z线', 100, centerY + 100);
        ctx.fillText('Z线', width - 100, centerY + 100);
        ctx.fillText('M线', width / 2, centerY + 100);
        ctx.fillText('肌球蛋白（粗肌丝）', width / 2, centerY - 20);
        ctx.fillText('肌动蛋白（细肌丝）', width / 2 - 70, centerY - 30);
        
        // 添加收缩状态说明
        ctx.font = '16px Arial';
        ctx.fillStyle = '#333';
        let stateText = '静息状态';
        if (pos > 0 && pos < 25) {
            stateText = '初始收缩';
        } else if (pos >= 25) {
            stateText = '收缩状态';
        }
        ctx.fillText(stateText, width / 2, 30);
        
        // 添加收缩百分比
        const percentage = Math.round((pos / 50) * 100);
        ctx.fillText(`收缩程度: ${percentage}%`, width / 2, 60);
    }
}

// 肌纤维类型比较工具
function initFiberTypeComparison() {
    const fiberComparisonContainer = document.getElementById('fiberTypeComparison');
    if (!fiberComparisonContainer) return;
    
    // 创建比较工具界面
    const comparisonTable = document.createElement('div');
    comparisonTable.className = 'comparison-table';
    comparisonTable.innerHTML = `
        <div class="comparison-header">
            <div class="comparison-cell header-cell">特性</div>
            <div class="comparison-cell header-cell">I型（慢氧化型）</div>
            <div class="comparison-cell header-cell">IIa型（快氧化糖酵解型）</div>
            <div class="comparison-cell header-cell">IIx型（快糖酵解型）</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">颜色</div>
            <div class="comparison-cell" id="color-type1">红色</div>
            <div class="comparison-cell" id="color-type2a">红-粉色</div>
            <div class="comparison-cell" id="color-type2x">白色</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">收缩速度</div>
            <div class="comparison-cell" id="speed-type1">慢</div>
            <div class="comparison-cell" id="speed-type2a">快</div>
            <div class="comparison-cell" id="speed-type2x">非常快</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">肌球蛋白ATPase活性</div>
            <div class="comparison-cell" id="atpase-type1">低</div>
            <div class="comparison-cell" id="atpase-type2a">高</div>
            <div class="comparison-cell" id="atpase-type2x">非常高</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">线粒体密度</div>
            <div class="comparison-cell" id="mitochondria-type1">高</div>
            <div class="comparison-cell" id="mitochondria-type2a">中等</div>
            <div class="comparison-cell" id="mitochondria-type2x">低</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">毛细血管密度</div>
            <div class="comparison-cell" id="capillary-type1">高</div>
            <div class="comparison-cell" id="capillary-type2a">中等</div>
            <div class="comparison-cell" id="capillary-type2x">低</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">糖原含量</div>
            <div class="comparison-cell" id="glycogen-type1">低</div>
            <div class="comparison-cell" id="glycogen-type2a">高</div>
            <div class="comparison-cell" id="glycogen-type2x">非常高</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">耐疲劳性</div>
            <div class="comparison-cell" id="fatigue-type1">高</div>
            <div class="comparison-cell" id="fatigue-type2a">中等</div>
            <div class="comparison-cell" id="fatigue-type2x">低</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">主要能量系统</div>
            <div class="comparison-cell" id="energy-type1">有氧</div>
            <div class="comparison-cell" id="energy-type2a">有氧+糖酵解</div>
            <div class="comparison-cell" id="energy-type2x">糖酵解</div>
        </div>
        <div class="comparison-row">
            <div class="comparison-cell">适合活动类型</div>
            <div class="comparison-cell" id="activity-type1">长时间低强度（马拉松）</div>
            <div class="comparison-cell" id="activity-type2a">中等时间中强度（800米跑）</div>
            <div class="comparison-cell" id="activity-type2x">短时间高强度（100米冲刺）</div>
        </div>
    `;
    fiberComparisonContainer.appendChild(comparisonTable);
    
    // 添加可视化比较
    const visualComparison = document.createElement('div');
    visualComparison.className = 'visual-comparison';
    visualComparison.innerHTML = `
        <h3>肌纤维类型可视化比较</h3>
        <div class="visual-controls">
            <button id="showType1" class="btn btn-primary active">显示I型</button>
            <button id="showType2a" class="btn btn-primary active">显示IIa型</button>
            <button id="showType2x" class="btn btn-primary active">显示IIx型</button>
        </div>
        <div class="visual-canvas-container">
            <canvas id="fiberTypeCanvas" width="600" height="400"></canvas>
        </div>
    `;
    fiberComparisonContainer.appendChild(visualComparison);
    
    // 初始化可视化
    const canvas = document.getElementById('fiberTypeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let showType1 = true;
    let showType2a = true;
    let showType2x = true;
    
    // 添加事件监听器
    document.getElementById('showType1').addEventListener('click', function() {
        this.classList.toggle('active');
        showType1 = this.classList.contains('active');
        drawFiberComparison();
    });
    
    document.getElementById('showType2a').addEventListener('click', function() {
        this.classList.toggle('active');
        showType2a = this.classList.contains('active');
        drawFiberComparison();
    });
    
    document.getElementById('showType2x').addEventListener('click', function() {
        this.classList.toggle('active');
        showType2x = this.classList.contains('active');
        drawFiberComparison();
    });
    
    // 初始绘制
    drawFiberComparison();
    
    // 绘制肌纤维类型比较
    function drawFiberComparison() {
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // 绘制坐标轴
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, height - 50);
        ctx.lineTo(width - 50, height - 50); // x轴
        ctx.moveTo(50, height - 50);
        ctx.lineTo(50, 50); // y轴
        ctx.stroke();
        
        // 添加坐标轴标签
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('收缩速度', width / 2, height - 20);
        
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('力量产生', 0, 0);
        ctx.restore();
        
        // 绘制数据点
        const dataPoints = [
            { type: 'I型', x: 150, y: height - 150, color: '#8b0000', show: showType1 },
            { type: 'IIa型', x: 300, y: height - 200, color: '#ff4500', show: showType2a },
            { type: 'IIx型', x: 450, y: height - 250, color: '#1e90ff', show: showType2x }
        ];
        
        // 绘制连接线
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 1;
        ctx.beginPath();
        let firstPoint = true;
        for (const point of dataPoints) {
            if (point.show) {
                if (firstPoint) {
                    ctx.moveTo(point.x, point.y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
        }
        ctx.stroke();
        
        // 绘制数据点
        for (const point of dataPoints) {
            if (point.show) {
                ctx.fillStyle = point.color;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.fillText(point.type, point.x, point.y - 20);
            }
        }
        
        // 添加图例
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        if (showType1) {
            ctx.fillStyle = '#8b0000';
            ctx.fillRect(width - 150, 70, 15, 15);
            ctx.fillStyle = '#000';
            ctx.fillText('I型（慢氧化型）', width - 130, 83);
        }
        
        if (showType2a) {
            ctx.fillStyle = '#ff4500';
            ctx.fillRect(width - 150, 95, 15, 15);
            ctx.fillStyle = '#000';
            ctx.fillText('IIa型（快氧化糖酵解型）', width - 130, 108);
        }
        
        if (showType2x) {
            ctx.fillStyle = '#1e90ff';
            ctx.fillRect(width - 150, 120, 15, 15);
            ctx.fillStyle = '#000';
            ctx.fillText('IIx型（快糖酵解型）', width - 130, 133);
        }
    }
    
    // 为表格单元格添加样式
    document.getElementById('color-type1').style.backgroundColor = '#ffcccc';
    document.getElementById('color-type2a').style.backgroundColor = '#ffddcc';
    document.getElementById('color-type2x').style.backgroundColor = '#f8f8f8';
}

// 力量-速度关系交互工具
function initForceVelocityTool() {
    const forceVelocityContainer = document.getElementById('forceVelocityTool');
    if (!forceVelocityContainer) return;
    
    // 创建工具界面
    const controls = document.createElement('div');
    controls.className = 'tool-controls';
    controls.innerHTML = `
        <div class="slider-container">
            <label for="velocitySlider">收缩速度: </label>
            <input type="range" id="velocitySlider" min="-100" max="100" value="0">
            <span id="velocityValue">0% (等长收缩)</span>
        </div>
    `;
    forceVelocityContainer.appendChild(controls);
    
    // 创建画布
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.innerHTML = `
        <canvas id="forceVelocityCanvas" width="600" height="400"></canvas>
    `;
    forceVelocityContainer.appendChild(canvasContainer);
    
    // 添加说明
    const explanation = document.createElement('div');
    explanation.className = 'tool-explanation';
    explanation.innerHTML = `
        <div class="info-box">
            <p><strong>说明：</strong> 此工具展示了肌肉力量与收缩速度的关系。负值表示离心收缩（肌肉被拉长），正值表示向心收缩（肌肉缩短），0表示等长收缩（肌肉长度不变）。</p>
            <p>注意力量-速度关系的特点：</p>
            <ul>
                <li>向心收缩：速度越快，力量越小</li>
                <li>等长收缩：产生最大向心力量</li>
                <li>离心收缩：可产生比等长收缩更大的力量</li>
            </ul>
        </div>
    `;
    forceVelocityContainer.appendChild(explanation);
    
    // 初始化画布
    const canvas = document.getElementById('forceVelocityCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let velocity = 0;
    
    // 添加事件监听器
    document.getElementById('velocitySlider').addEventListener('input', function() {
        velocity = parseInt(this.value);
        updateVelocityDisplay();
        drawForceVelocityCurve();
    });
    
    // 初始绘制
    updateVelocityDisplay();
    drawForceVelocityCurve();
    
    // 更新速度显示
    function updateVelocityDisplay() {
        const velocityDisplay = document.getElementById('velocityValue');
        let text = `${velocity}% `;
        
        if (velocity < 0) {
            text += "(离心收缩)";
        } else if (velocity > 0) {
            text += "(向心收缩)";
        } else {
            text += "(等长收缩)";
        }
        
        velocityDisplay.textContent = text;
    }
    
    // 绘制力量-速度曲线
    function drawForceVelocityCurve() {
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // 绘制坐标轴
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2, height - 50);
        ctx.lineTo(width / 2, 50); // y轴
        ctx.moveTo(50, height - 100);
        ctx.lineTo(width - 50, height - 100); // x轴
        ctx.stroke();
        
        // 添加坐标轴标签
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('收缩速度', width / 2, height - 20);
        ctx.fillText('离心', width / 4, height - 70);
        ctx.fillText('向心', width * 3 / 4, height - 70);
        
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('力量 (% 最大等长力量)', 0, 0);
        ctx.restore();
        
        // 绘制力量-速度曲线
        ctx.strokeStyle = '#1e90ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        // 离心部分（左侧）
        ctx.moveTo(50, height - 250);
        ctx.bezierCurveTo(
            width / 4, height - 250,
            width / 2 - 50, height - 200,
            width / 2, height - 200
        );
        
        // 向心部分（右侧）
        ctx.bezierCurveTo(
            width / 2 + 50, height - 200,
            width * 3 / 4, height - 100,
            width - 50, height - 50
        );
        
        ctx.stroke();
        
        // 绘制功率曲线
        ctx.strokeStyle = '#ff4500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // 离心部分（左侧）- 功率为负
        ctx.moveTo(50, height - 100);
        ctx.bezierCurveTo(
            width / 4, height - 50,
            width / 2 - 50, height - 100,
            width / 2, height - 100
        );
        
        // 向心部分（右侧）- 功率为正，呈倒U形
        ctx.bezierCurveTo(
            width / 2 + 50, height - 100,
            width / 2 + 100, height - 180,
            width * 3 / 4, height - 180
        );
        
        ctx.bezierCurveTo(
            width * 3 / 4 + 50, height - 180,
            width - 100, height - 120,
            width - 50, height - 100
        );
        
        ctx.stroke();
        
        // 添加图例
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        ctx.strokeStyle = '#1e90ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width - 150, 70);
        ctx.lineTo(width - 120, 70);
        ctx.stroke();
        
        ctx.fillStyle = '#000';
        ctx.fillText('力量', width - 110, 74);
        
        ctx.strokeStyle = '#ff4500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width - 150, 95);
        ctx.lineTo(width - 120, 95);
        ctx.stroke();
        
        ctx.fillStyle = '#000';
        ctx.fillText('功率', width - 110, 99);
        
        // 绘制当前位置
        const xPos = width / 2 + (velocity / 100) * (width / 2 - 50);
        
        // 计算力量值（根据曲线）
        let force;
        if (velocity < 0) {
            // 离心部分
            force = 100 + Math.abs(velocity) * 0.5;
            if (force > 180) force = 180;
        } else {
            // 向心部分
            force = 100 * Math.exp(-velocity / 50);
        }
        
        const yPos = height - 100 - (force - 100);
        
        // 计算功率值
        let power;
        if (velocity < 0) {
            // 离心部分 - 负功率
            power = -Math.abs(velocity) * force / 300;
        } else {
            // 向心部分 - 正功率，在30-40%最大速度时达到峰值
            power = (velocity * force / 100) * Math.exp(-(velocity - 35) * (velocity - 35) / 800);
        }
        
        const powerYPos = height - 100 - power * 1.5;
        
        // 绘制当前位置标记
        ctx.fillStyle = '#1e90ff';
        ctx.beginPath();
        ctx.arc(xPos, yPos, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.arc(xPos, powerYPos, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // 显示当前值
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.font = '14px Arial';
        ctx.fillText(`当前力量: ${Math.round(force)}% 最大等长力量`, 60, 80);
        ctx.fillText(`当前功率: ${Math.round(power * 100) / 100}`, 60, 110);
    }
}

// 肌节结构交互式探索工具
function initSarcomereExplorer() {
    const sarcomereContainer = document.getElementById('sarcomereExplorer');
    if (!sarcomereContainer) return;
    
    // 创建工具界面
    const controls = document.createElement('div');
    controls.className = 'explorer-controls';
    controls.innerHTML = `
        <div class="button-group">
            <button id="showAll" class="btn btn-primary active">显示全部</button>
            <button id="showZLines" class="btn btn-secondary">Z线</button>
            <button id="showMLine" class="btn btn-secondary">M线</button>
            <button id="showThickFilaments" class="btn btn-secondary">粗肌丝</button>
            <button id="showThinFilaments" class="btn btn-secondary">细肌丝</button>
            <button id="showCrossBridges" class="btn btn-secondary">横桥</button>
        </div>
    `;
    sarcomereContainer.appendChild(controls);
    
    // 创建画布
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.innerHTML = `
        <canvas id="sarcomereCanvas" width="700" height="400"></canvas>
    `;
    sarcomereContainer.appendChild(canvasContainer);
    
    // 添加说明面板
    const infoPanel = document.createElement('div');
    infoPanel.className = 'info-panel';
    infoPanel.innerHTML = `
        <h3 id="infoTitle">肌节结构</h3>
        <p id="infoDescription">肌节是骨骼肌的基本结构和功能单位，由两条相邻Z线之间的区域组成。点击上方按钮查看各组成部分。</p>
    `;
    sarcomereContainer.appendChild(infoPanel);
    
    // 初始化画布
    const canvas = document.getElementById('sarcomereCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let showZLines = true;
    let showMLine = true;
    let showThickFilaments = true;
    let showThinFilaments = true;
    let showCrossBridges = true;
    
    // 添加事件监听器
    document.getElementById('showAll').addEventListener('click', function() {
        this.classList.add('active');
        document.querySelectorAll('.explorer-controls .btn-secondary').forEach(btn => {
            btn.classList.remove('active');
        });
        
        showZLines = true;
        showMLine = true;
        showThickFilaments = true;
        showThinFilaments = true;
        showCrossBridges = true;
        
        updateInfoPanel('肌节结构', '肌节是骨骼肌的基本结构和功能单位，由两条相邻Z线之间的区域组成。点击上方按钮查看各组成部分。');
        drawSarcomereStructure();
    });
    
    document.getElementById('showZLines').addEventListener('click', function() {
        toggleButton(this);
        showZLines = this.classList.contains('active');
        
        if (showZLines) {
            updateInfoPanel('Z线', 'Z线是肌节的边界，也是肌动蛋白细肌丝的锚定点。Z线由α-肌动蛋白、肌联蛋白和其他蛋白质组成，形成一个网状结构。');
        }
        
        drawSarcomereStructure();
    });
    
    document.getElementById('showMLine').addEventListener('click', function() {
        toggleButton(this);
        showMLine = this.classList.contains('active');
        
        if (showMLine) {
            updateInfoPanel('M线', 'M线位于肌节中央，由蛋白质结构组成，连接相邻的肌球蛋白丝。M线蛋白有助于维持粗肌丝的排列和稳定性。');
        }
        
        drawSarcomereStructure();
    });
    
    document.getElementById('showThickFilaments').addEventListener('click', function() {
        toggleButton(this);
        showThickFilaments = this.classList.contains('active');
        
        if (showThickFilaments) {
            updateInfoPanel('粗肌丝（肌球蛋白）', '粗肌丝主要由肌球蛋白分子组成，每个肌球蛋白分子都有一个尾部和两个头部。头部含有ATPase活性，能够水解ATP并与肌动蛋白结合形成横桥。');
        }
        
        drawSarcomereStructure();
    });
    
    document.getElementById('showThinFilaments').addEventListener('click', function() {
        toggleButton(this);
        showThinFilaments = this.classList.contains('active');
        
        if (showThinFilaments) {
            updateInfoPanel('细肌丝（肌动蛋白）', '细肌丝主要由肌动蛋白、原肌球蛋白和肌钙蛋白复合物组成。肌动蛋白形成双螺旋结构，原肌球蛋白在静息状态下覆盖肌动蛋白上的肌球蛋白结合位点。');
        }
        
        drawSarcomereStructure();
    });
    
    document.getElementById('showCrossBridges').addEventListener('click', function() {
        toggleButton(this);
        showCrossBridges = this.classList.contains('active');
        
        if (showCrossBridges) {
            updateInfoPanel('横桥', '横桥是肌球蛋白头部与肌动蛋白的结合。在肌肉收缩过程中，横桥循环产生力量，使粗细肌丝相互滑行，导致肌节缩短。');
        }
        
        drawSarcomereStructure();
    });
    
    // 初始绘制
    drawSarcomereStructure();
    
    // 切换按钮状态
    function toggleButton(button) {
        document.getElementById('showAll').classList.remove('active');
        button.classList.toggle('active');
    }
    
    // 更新信息面板
    function updateInfoPanel(title, description) {
        document.getElementById('infoTitle').textContent = title;
        document.getElementById('infoDescription').textContent = description;
    }
    
    // 绘制肌节结构
    function drawSarcomereStructure() {
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerY = height / 2;
        const sarcomereWidth = width - 100;
        
        // 绘制背景
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(50, centerY - 100, sarcomereWidth, 200);
        
        // 绘制Z线
        if (showZLines) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(50, centerY - 100);
            ctx.lineTo(50, centerY + 100);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(width - 50, centerY - 100);
            ctx.lineTo(width - 50, centerY + 100);
            ctx.stroke();
            
            // 添加标签
            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Z线', 50, centerY + 120);
            ctx.fillText('Z线', width - 50, centerY + 120);
        }
        
        // 绘制M线
        if (showMLine) {
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width / 2, centerY - 90);
            ctx.lineTo(width / 2, centerY + 90);
            ctx.stroke();
            
            // 添加标签
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('M线', width / 2, centerY + 120);
        }
        
        // 绘制粗肌丝（肌球蛋白）
        if (showThickFilaments) {
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.rect(width / 2 - 150, centerY - 15, 300, 30);
            ctx.fill();
            
            // 添加标签
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('粗肌丝（肌球蛋白）', width / 2, centerY - 25);
        }
        
        // 绘制细肌丝（肌动蛋白）
        if (showThinFilaments) {
            ctx.fillStyle = '#f44336';
            
            // 左侧细肌丝
            ctx.beginPath();
            ctx.rect(50, centerY - 7, 200, 14);
            ctx.fill();
            
            // 右侧细肌丝
            ctx.beginPath();
            ctx.rect(width - 50 - 200, centerY - 7, 200, 14);
            ctx.fill();
            
            // 添加标签
            ctx.fillStyle = '#f44336';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('细肌丝（肌动蛋白）', 150, centerY - 25);
            ctx.fillText('细肌丝（肌动蛋白）', width - 150, centerY - 25);
        }
        
        // 绘制横桥
        if (showCrossBridges && showThickFilaments && showThinFilaments) {
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            
            // 左侧横桥
            for (let i = 0; i < 10; i++) {
                const x = width / 2 - 140 + i * 15;
                const y1 = centerY - 15;
                const y2 = centerY - 7;
                
                ctx.beginPath();
                ctx.moveTo(x, y1);
                ctx.quadraticCurveTo(x - 5, (y1 + y2) / 2, x - 10, y2);
                ctx.stroke();
            }
            
            // 右侧横桥
            for (let i = 0; i < 10; i++) {
                const x = width / 2 + 140 - i * 15;
                const y1 = centerY + 15;
                const y2 = centerY + 7;
                
                ctx.beginPath();
                ctx.moveTo(x, y1);
                ctx.quadraticCurveTo(x + 5, (y1 + y2) / 2, x + 10, y2);
                ctx.stroke();
            }
            
            // 添加标签
            ctx.fillStyle = '#555';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('横桥', width / 2 - 100, centerY + 50);
        }
        
        // 绘制区域标签
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // A带
        if (showThickFilaments) {
            ctx.fillText('A带', width / 2, centerY + 70);
        }
        
        // I带
        if (showThinFilaments && !showThickFilaments) {
            ctx.fillText('I带', 150, centerY + 70);
            ctx.fillText('I带', width - 150, centerY + 70);
        }
        
        // H区
        if (showThickFilaments && !showThinFilaments) {
            ctx.fillText('H区', width / 2, centerY + 50);
        }
    }
}

// 发放频率与肌肉张力交互工具
function initFiringRateTool() {
    const firingRateContainer = document.getElementById('firingRateTool');
    if (!firingRateContainer) return;
    
    // 创建工具界面
    const controls = document.createElement('div');
    controls.className = 'tool-controls';
    controls.innerHTML = `
        <div class="slider-container">
            <label for="firingRateSlider">发放频率 (Hz): </label>
            <input type="range" id="firingRateSlider" min="1" max="60" value="10">
            <span id="firingRateValue">10 Hz</span>
        </div>
    `;
    firingRateContainer.appendChild(controls);
    
    // 创建画布
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.innerHTML = `
        <canvas id="firingRateCanvas" width="600" height="300"></canvas>
    `;
    firingRateContainer.appendChild(canvasContainer);
    
    // 添加说明
    const explanation = document.createElement('div');
    explanation.className = 'tool-explanation';
    explanation.innerHTML = `
        <div class="info-box">
            <p><strong>说明：</strong> 此工具展示了运动神经元发放频率与肌肉张力的关系。</p>
            <p>注意以下特点：</p>
            <ul>
                <li>低频率（<10 Hz）：产生单收缩，张力波动大</li>
                <li>中频率（10-30 Hz）：产生不完全强直收缩，张力有波动但平均水平提高</li>
                <li>高频率（>30 Hz）：产生完全强直收缩，张力平滑且达到最大</li>
            </ul>
        </div>
    `;
    firingRateContainer.appendChild(explanation);
    
    // 初始化画布
    const canvas = document.getElementById('firingRateCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let firingRate = 10;
    let animationId;
    let time = 0;
    
    // 添加事件监听器
    document.getElementById('firingRateSlider').addEventListener('input', function() {
        firingRate = parseInt(this.value);
        document.getElementById('firingRateValue').textContent = `${firingRate} Hz`;
    });
    
    // 开始动画
    animate();
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawFiringRateEffect();
        
        time += 0.05;
        animationId = requestAnimationFrame(animate);
    }
    
    // 绘制发放频率效应
    function drawFiringRateEffect() {
        const width = canvas.width;
        const height = canvas.height;
        
        // 绘制坐标轴
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, height - 50);
        ctx.lineTo(width - 50, height - 50); // x轴
        ctx.moveTo(50, height - 50);
        ctx.lineTo(50, 50); // y轴
        ctx.stroke();
        
        // 添加坐标轴标签
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('时间 (ms)', width / 2, height - 20);
        
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('张力 (% 最大)', 0, 0);
        ctx.restore();
        
        // 计算时间间隔（毫秒）
        const interval = 1000 / firingRate;
        
        // 绘制发放标记
        ctx.fillStyle = '#1e90ff';
        const timeScale = (width - 100) / 500; // 500ms显示范围
        
        for (let t = 0; t < 500; t += interval) {
            const x = 50 + (t * timeScale);
            
            ctx.beginPath();
            ctx.moveTo(x, height - 50);
            ctx.lineTo(x, height - 60);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(x, height - 65, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 绘制张力曲线
        ctx.strokeStyle = '#ff4500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, height - 50);
        
        // 单收缩持续时间约100ms
        const twitch = (t) => {
            if (t <= 0) return 0;
            if (t > 100) return 0;
            
            // 简化的单收缩曲线
            return 70 * Math.sin((t / 100) * Math.PI);
        };
        
        // 计算每个时间点的张力（时间加和）
        for (let x = 0; x <= width - 50; x++) {
            const t = (x - 50) / timeScale;
            let tension = 0;
            
            // 计算所有先前刺激的累积效应
            for (let prevT = 0; prevT < 500; prevT += interval) {
                tension += twitch(t - prevT);
            }
            
            // 限制最大张力
            if (tension > 100) tension = 100;
            
            const y = height - 50 - (tension / 100) * (height - 100);
            
            if (x === 50) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // 添加当前状态说明
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.font = '14px Arial';
        
        let stateText = '';
        if (firingRate < 10) {
            stateText = '单收缩';
        } else if (firingRate < 30) {
            stateText = '不完全强直收缩';
        } else {
            stateText = '完全强直收缩';
        }
        
        ctx.fillText(`当前状态: ${stateText}`, 60, 30);
        
        // 计算平均张力
        let avgTension = 0;
        if (firingRate < 10) {
            avgTension = firingRate * 25;
            if (avgTension > 70) avgTension = 70;
        } else if (firingRate < 30) {
            avgTension = 70 + (firingRate - 10) * 1.5;
            if (avgTension > 100) avgTension = 100;
        } else {
            avgTension = 100;
        }
        
        ctx.fillText(`平均张力: ${Math.round(avgTension)}% 最大`, 60, 60);
    }
}

// 通用工具函数
function showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // 添加到文档
    document.body.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
